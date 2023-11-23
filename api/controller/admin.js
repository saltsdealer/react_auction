import { dbUser } from "../db.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import bcrypt from "bcryptjs";

export const deleteUser = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json("Not authenticated!");
    }

    jwt.verify(token, "adminkey");

    const userId = req.body.userid;
    // delete in user table

    const result = await dbUser
      .promise()
      .query("DELETE FROM `User` WHERE user_id = ?", [userId]);

    // delete in user_key table
    await dbUser
      .promise()
      .query("DELETE FROM user_key WHERE user_id = ?", [userId]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json("No such user exists!");
    }

    // add in cancelled_users table
    await dbUser
      .promise()
      .query("INSERT INTO cancelled_users (user_id) VALUE ( ? )", [userId]);

    return res.json("User has been deleted!");
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json("Token is not valid!");
    } else {
      return res.status(500).json(err.message);
    }
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json("Not authenticated!");
    }

    jwt.verify(token, "adminkey");

    const productId = req.body.productid;

    // Delete from prod_pic table
    await dbUser
      .promise()
      .query("DELETE FROM prod_pic WHERE prod_id = ?", [productId]);

    // Delete from BidProduct table
    await dbUser
      .promise()
      .query("DELETE FROM BidProduct WHERE product_id = ?", [productId]);

    // Delete from product table
    const result = await dbUser
      .promise()
      .query("DELETE FROM product WHERE product_id = ?", [productId]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json("No such product exists!");
    }

    return res.json("Product has been deleted!");
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json("Token is not valid!");
    } else {
      return res.status(500).json(err.message);
    }
  }
};

export const getData = async (req, res) => {
  const category = req.params.category;
  const year = req.params.year;
  const q1_usr_aggre = `
      SELECT
        YEAR(months.month_start) AS year,
        MONTH(months.month_start) AS month,
        COUNT(DISTINCT user_id) AS val
      FROM
        (SELECT 
            CONCAT(YEAR(create_time), '-', LPAD(MONTH(create_time), 2, '0'), '-01') AS month_start,
            LAST_DAY(create_time) AS month_end
        FROM 
            User
        Where YEAR(create_time) = ?
        GROUP BY 
            month_start, month_end) AS months
      JOIN 
        User ON (create_time <= months.month_end AND (end_time IS NULL OR end_time > months.month_start))
      GROUP BY
        year,
        month
      ORDER BY
        year,
        month;
  `;
  const q1_usr_increase = `
      SELECT
        YEAR(create_time) AS year,
        MONTH(create_time) AS month,
        COUNT(DISTINCT user_id) AS val
      FROM
          User
      WHERE
          YEAR(create_time) = ?
          AND create_time <= LAST_DAY(CONCAT(YEAR(create_time), '-', MONTH(create_time), '-01'))
          AND (end_time IS NULL OR end_time > LAST_DAY(CONCAT(YEAR(create_time), '-', MONTH(create_time), '-01')))
      GROUP BY
          YEAR(create_time),
          MONTH(create_time)
      ORDER BY
          year,
          month;
      `;

  const q1_usr_prev = `
      SELECT val
      FROM
        ( SELECT
            YEAR(months.month_start) AS year,
            MONTH(months.month_start) AS month,
            COUNT(DISTINCT user_id) AS val
          FROM
            (SELECT 
                CONCAT(YEAR(create_time), '-', LPAD(MONTH(create_time), 2, '0'), '-01') AS month_start,
                LAST_DAY(create_time) AS month_end
            FROM 
                User
            Where YEAR(create_time) = ?-1
            GROUP BY 
                month_start, month_end) AS months
          JOIN 
            User ON (create_time <= months.month_end AND (end_time IS NULL OR end_time > months.month_start))
          GROUP BY
            year,
            month
          ORDER BY
            year DESC,
            month DESC   
        ) t
      LIMIT 1;
  `;

  const q2_rvn_aggre = `
        SELECT
          sq.year,
          sq.month,
          SUM(sq.monthly_revenue) OVER (ORDER BY sq.year, sq.month) AS val
        FROM
          (SELECT
              YEAR(o.create_time) AS year,
              MONTH(o.create_time) AS month,
              SUM(oc.final_price) AS monthly_revenue
          FROM
            \`order\` o
          JOIN
              order_creation oc ON o.order_id = oc.order_id
          WHERE 
              YEAR(o.create_time) = ?
          GROUP BY
              YEAR(o.create_time),
              MONTH(o.create_time)
          ) AS sq
        ORDER BY
          sq.year,
          sq.month;
    `;

  const q2_rvn_increase = `
        SELECT
          YEAR(o.create_time) AS year,
          MONTH(o.create_time) AS month,
          SUM(oc.final_price) AS val
        FROM
          \`order\` o
        JOIN
          order_creation oc ON o.order_id = oc.order_id
        WHERE
          YEAR(o.create_time) = ?
        GROUP BY
          YEAR(o.create_time),
          MONTH(o.create_time)
        ORDER BY
          year,
          month;
  `;

  const q2_rvn_prev = `
      SELECT val
      FROM
        (SELECT
          sq.year,
          sq.month,
          SUM(sq.monthly_revenue) OVER (ORDER BY sq.year, sq.month) AS val
        FROM
          (SELECT
              YEAR(o.create_time) AS year,
              MONTH(o.create_time) AS month,
              SUM(oc.final_price) AS monthly_revenue
          FROM
            \`order\` o
          JOIN
              order_creation oc ON o.order_id = oc.order_id
          WHERE 
              YEAR(o.create_time) = ? -1
          GROUP BY
              YEAR(o.create_time),
              MONTH(o.create_time)
          ) AS sq
        ORDER BY
          sq.year DESC,
          sq.month DESC
        ) t
      LIMIT 1;
    `;

  const labels = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  let aggregate = new Array(12).fill(0);
  let increasing = new Array(12).fill(0);

  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json("Not authenticated!");
    }

    jwt.verify(token, "adminkey");

    let result_aggre = [];
    let result_increase = [];
    let prev = 0;

    // check route and get data
    if (category === "user") {
      const result1 = await dbUser.promise().query(q1_usr_aggre, [year]);
      result_aggre = result1[0];

      const result2 = await dbUser.promise().query(q1_usr_increase, [year]);
      result_increase = result2[0];

      const result3 = await dbUser.promise().query(q1_usr_prev, [year]);
      if (result3[0].length != 0) {
        prev = result3[0][0].val;
      }
    } else if (category === "revenue") {
      const result1 = await dbUser.promise().query(q2_rvn_aggre, [year]);
      result_aggre = result1[0];

      const result2 = await dbUser.promise().query(q2_rvn_increase, [year]);
      result_increase = result2[0];

      const result3 = await dbUser.promise().query(q2_rvn_prev, [year]);
      if (result3[0].length != 0) {
        prev = result3[0][0].val;
      }
    }

    // pass results into arrays
    for (let row of result_aggre) {
      aggregate[row.month - 1] = row.val;
    }
    for (let row of result_increase) {
      increasing[row.month - 1] = row.val;
    }

    if (aggregate[0] === 0 && prev != null) {
      aggregate[0] = prev;
    }
    for (let i = 1; i < 12; i++) {
      if (aggregate[i] === 0) {
        aggregate[i] = aggregate[i - 1];
      }
    }

    return res.json({ labels, aggregate, increasing });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json("Token is not valid!");
    } else {
      return res.status(500).json(err.message);
    }
  }
};
