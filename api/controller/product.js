import {db} from "../db.js"
import jwt from "jsonwebtoken";
import moment from "moment";

export const getProducts = (req,res) =>{
    
    const baseQuery = `
    SELECT 
        p.pname,
        p.product_id, 
        p.user_id,
        p.price,
        p.description,
        p.prod_id,
        pp.picture, 
        CASE 
            WHEN p.end_time != '2037-01-19 03:13:07' THEN 'sold' 
            ELSE 'unsold' 
        END AS \`status\`
    FROM 
        Product p 
    JOIN 
        prod_pic pp ON p.product_id = pp.prod_id
    `;

    const q = req.query.cat 
    ? `${baseQuery} WHERE p.prod_id = ? AND p.end_time != '1999-09-09 09:09:09';`
    : `${baseQuery} WHERE p.end_time = '2037-01-19 03:13:07';`;

    db.query(q,[req.query.cat],(err,data)=>{
        if(err) return res.send(err);
        //console.log(data[0]);
        // RowDataPacket {
        //     product_id: 'prod202310270900002000',
        //     user_id: '123456789',
        //     price: 9.99,
        //     description: 'Latest iPhone',
        //     prod_id: 'ELC',
        //     picture: 'https://i.postimg.cc/SJvyCMGN/aj.png'
        //   }
        return res.status(200).json(data);
    });


};

export const getProduct = (req,res) =>{
    const q = `
                SELECT 
                    user_name, 
                    pname, 
                    description, 
                    picture, 
                    p.prod_id, 
                    p.create_time,
                    p.user_id,
                    uk.username,
                    p.product_id,
                    p.price
                FROM USER u 
                JOIN product p 
                ON u.user_id = p.user_id 
                JOIN prod_pic pp ON p.product_id = pp.prod_id
                JOIN user_key uk on u.user_id = uk.user_id
                WHERE p.product_id = ?;
                `;
    db.query(q,[req.params.id],(err,data)=>{
        //console.log(req.params.product_id);
        if(err) return res.send(err);
        //console.log(data);
        return res.status(200).json(data[0]);
    });
};

function constructSQLQuery(searchParams) {
  let baseQuery = 'SELECT * FROM product p JOIN prod_pic pp ON p.product_id = pp.prod_id WHERE ';
  let conditions = [];
  let params = [];
  
  console.log("1");
  if (searchParams.pname) {
    conditions.push("pname LIKE ?");
    params.push('%' + searchParams.pname + '%');
}
  console.log(conditions);
  if (searchParams.category) {
    conditions.push('category = ?');
    params.push(searchParams.category);
  }
  if (searchParams.stateUploaded) {
    conditions.push('stateUploaded = ?');
    params.push(searchParams.stateUploaded);
  }
  if (searchParams.lowerPrice) {
    conditions.push('price >= ?');
    params.push(searchParams.lowerPrice);
  }
  if (searchParams.upperPrice) {
    conditions.push('price <= ?');
    params.push(searchParams.upperPrice);
  }

  // Join conditions with 'AND'
  let query = conditions.length ? baseQuery + conditions.join(' AND ') : "";
  return { query, params };
}

export const getProductVaguely = async (req,res) => {
  try {
    console.log(req.body);
    const { query, params } = constructSQLQuery(req.body);
    if (!query) return res.status(500).json("No search implemented");
    console.log("Q:",query);
    console.log("P:",params);
    // Perform the database query with the constructed SQL
    try {
      const { query, params } = constructSQLQuery(req.body);
  
      db.query(query, params, async (err, products) => {
        if (err) {
          console.error('Error occurred: ', err);
          return res.status(500).send('An error occurred');
        }
  
        //console.log('Products: ', products, 'Type:', typeof products);
        return res.status(200).json(products);
      });
    } catch (error) {
      console.error('Error occurred: ', error);
      res.status(500).send('Server error');
    }
    
  } catch (error) {
    throw new Error('Error during search operation');
  }
};

export const addProduct = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json("Not authenticated!");
    }

    const userInfo = jwt.verify(token, "jwtkey");

    const create_time = moment(Date.now()).format("YYYYMMDDHHmmss");
    const product_id = "prod" + create_time + userInfo.id;

    const values_product = [
      product_id,
      userInfo.id,
      req.body.price,
      req.body.weight,
      req.body.create_time,
      "2037-01-19 03:13:07",
      req.body.desc,
      req.body.cat,
      req.body.address_id,
      req.body.title,
    ];

    const imgUrl = `../upload/${req.body.picture}`;
    const values_pic = [product_id, imgUrl];

    // Inserting into prod_pic table
    await db.query(`INSERT INTO prod_pic(prod_id, picture) VALUES(?)`, [values_pic]);

    // Inserting into product table
    await db.query(`INSERT INTO product (product_id, user_id, price, weight, 
      create_time, end_time, description, prod_id, address_id, pname) VALUES (?)`, 
      [values_product]);

    return res.json("Product has been created.");
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

    const userInfo = jwt.verify(token, "jwtkey");

    
    const postId = req.params.id;
    
    // somthing wrong on this deletion parts
    // const picResult = db.query("SELECT picture FROM prod_pic WHERE prod_id = ?", [postId]);
    
    // if (picResult.length > 0) {
    //   const filePath = picResult[0].picture;

    //   // Delete the file from the file system
    //   await fs.unlink(filePath);
    // }

    // Delete from prod_pic table
    await db.query("DELETE FROM prod_pic WHERE prod_id = ?", [postId]);

    // Update product table
    // const result = await db.query("DELETE FROM product WHERE `product_id` = ? AND `user_id` = ?", [postId, userInfo.id]);
    const result = await db.query("UPDATE product SET `end_time` = '1999-09-09 09:09:09' WHERE `product_id` = ? AND `user_id` = ?", [postId, userInfo.id]);
    if (result.affectedRows === 0) {
      return res.status(403).json("You can delete only your post!");
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

export const updateProduct = (req,res) =>{
const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q =
      "UPDATE product SET `panme`=?,`price` = ?, `weight` = ?, `description`=?,`cat`=? WHERE `product_id` = ? AND `user_id` = ?";

    const values = [req.body.title, req.body.price, req.body.weight, req.body.desc, req.body.cat];

    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Product has been updated.");
    });
  });
};
