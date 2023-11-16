import {db} from "../db.js"
import jwt from "jsonwebtoken";

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
    ? `${baseQuery} WHERE p.prod_id = ?;`
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
                    p.user_id
                FROM USER u 
                JOIN product p 
                ON u.user_id = p.user_id 
                JOIN prod_pic pp ON p.product_id = pp.prod_id
                WHERE p.product_id = ?;
                `;
    db.query(q,[req.params.id],(err,data)=>{
        console.log(req.params.product_id);
        if(err) return res.send(err);
        console.log(data);
        return res.status(200).json(data[0]);
    });
};

export const addProduct = (req,res) =>{
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      `INSERT INTO product (product_id, user_id, price,weight, create_time, end_time,description,prod_id, address_id,pname) VALUES (?);
      INSERT INTO prod_pic(product_id, picture) VALUES(?);`;
    
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

    const values_pic = [
        product_id,
        req.body.img,
      ];

    db.query(q, [values_product,values_pic], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  });
};

export const deleteProduct = (req,res) =>{
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const postId = req.params.id;
    const q = "UPDATE product SET end_time = ? WHERE `product_id` = ? AND `user_id` = ?";

    db.query(q, [currentTime, postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted!");
    });
  });
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
      return res.json("Post has been updated.");
    });
  });
};
