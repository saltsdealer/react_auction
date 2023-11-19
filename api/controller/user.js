import { db } from "../db.js"
import jwt from "jsonwebtoken";
import moment from "moment";
import bcrypt from "bcryptjs"

export const getUser = (req, res) => {
  const userIdQuery = `SELECT user_id FROM user_key WHERE username = ?;`;

  db.query(userIdQuery, [req.params.id], (err, userIdResult) => {
    if (err) {
      console.error("Error fetching user ID:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (userIdResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userIdResult[0].user_id;

    const userDetailsQuery = `
          SELECT u.user_id, u.user_name, u.add_id, u.address_detail, m.manager_id, u.create_time, uk.username as nickname,
          uk.email
          FROM user u
          JOIN manager m ON u.manager_id = m.manager_id
          JOIN user_key uk ON u.user_id = uk.user_id 
          WHERE u.user_id = ?;
      `;

    db.query(userDetailsQuery, [userId], (err, userDetails) => {
      if (err) {
        console.error("Error fetching user details:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const userProductsQuery = `
              SELECT p.product_id, p.pname, p.description, p.price,
                     CASE WHEN p.end_time != '2037-01-19 03:13:07' THEN 'sold' ELSE 'unsold' END AS status,
                     pp.picture
              FROM product p
              JOIN prod_pic pp ON p.product_id = pp.prod_id
              WHERE p.user_id = ?;
          `;

      db.query(userProductsQuery, [userId], (err, userProducts) => {
        if (err) {
          console.error("Error fetching user products:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        //   const responseData = {
        //     userDetails: userDetails[0],
        //     userProducts: userProducts
        // };
        userDetails = userDetails[0]
        // console.log("Response data:", responseData);
        // Send combined response
        return res.status(200).json({ userDetails, userProducts });
      });
    });
  });
};

export const getUserBought = (req, res) => {
  const q = `
                SELECT 
                    uk.username, 
                    p.pname,
                    p.product_id,
                    o.create_time,
                    o.end_time,
                    o.seller_rate,
                    o.buyer_rate,
                    pp.picture,
                    uk.email,
                    CASE 
                        WHEN p.end_time != '2037-01-19 03:13:07' THEN 'finished' 
                        ELSE 'ongoing' 
                    END AS status
                FROM 
                    user_key uk
                JOIN 
                    order_creation oc ON uk.user_id = oc.buyer_id
                JOIN 
                    BidSession bs ON oc.bid_session_id = bs.bid_session_id
                JOIN 
                    BidProduct bp ON bs.bid_session_id = bp.bid_session_id
                JOIN 
                    \`order\` o ON oc.order_id = o.order_id
                JOIN 
                    Product p ON bp.product_id = p.product_id
                JOIN
                    prod_pic pp ON p.product_id = pp.prod_id
                WHERE 
                    uk.username = ?;`;

  db.query(q, [req.params.id], (err, data) => {
    //console.log(req.params.product_id);
    if (err) return res.send(err);

    return res.status(200).json(data);
  });
};

export const deleteUser = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json("Not authenticated!");
    }

    const userInfo = jwt.verify(token, "jwtkey");


    const postId = req.params.id;
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // Update user table
    const result = await db.query("UPDATE `user` SET `end_time` = ? WHERE user_id = ?", [currentTime, userInfo.id]);
    const result_key = await db.query("DELETE FROM user_key WHERE user_id = ?", [userInfo.id]);

    if (result.affectedRows === 0 || result_key.affectedRows ===0 ) {
      return res.status(403).json("You can delete only your account!");
    }

    return res.json("User has been deleted!");
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json("Token is not valid!");
    } else {
      return res.status(500).json(err.message);
    }
  }
};

export const updateUser = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not authenticated!" });

  try {
    await jwt.verify(token, "jwtkey");

    const userId = req.params.id;
    const updatePassword = req.body.pw;

    let hashedPassword;
    if (updatePassword) {
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(updatePassword, salt);
    }

    const q_user_key = "UPDATE user_key SET `username`=?, `password`=?, `email`=? WHERE `user_id`=?;";
    const q_user_nokey = "UPDATE user_key SET `username`=?, `email`=? WHERE `user_id`=?;";
    const q_user = "UPDATE `user` SET `user_name`=?, `add_id`=?, `address_detail`=? WHERE `user_id`=?;";

    const values_user = [req.body.uname, req.body.add, req.body.address, userId];
    const values_keys = [req.body.nname, hashedPassword, req.body.email, userId];
    const values_nokeys = [req.body.nname, req.body.email, userId];

    const query = updatePassword ? q_user_key : q_user_nokey;
    const values = updatePassword ? values_keys : values_nokeys;

    await db.query(query, values);
    await db.query(q_user, values_user);

    res.json({ message: "User has been updated." });
  } catch (err) {
    console.error("Error in updateUser:", err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};
