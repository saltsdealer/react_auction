
import {db} from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = (req, res) => {
    //CHECK EXISTING USER
    console.log("it is started");
    const q = "SELECT * FROM user_key WHERE user_id = ? OR email = ?";
    const q1 = "SELECT * FROM NUID WHERE id = ?";
    /*  this to use when check qualifications 
    db.query(q1,[req.body.nuid],(err,data) =>{
      if (!data.length) return res.status(409).json("User not in Khrouy College!");
    });
    */
    db.query(q, [req.body.user_id, req.body.email], (err, data) => {
        
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("User already exists!");
      
      //Hash the password and create a user
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      
      const q = "INSERT INTO user_key (`user_id`,`password`,`username`,`email`) VALUES (?)";
      const values = [req.body.user_id,hash,req.body.username,req.body.email];
      
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
      });
    });
  };

export const login =(req,res) =>{
    const q = "SELECT * FROM user_key WHERE username = ?"
    db.query(q,[req.body.username],(err,data)=>{
      if (err) return res.json(err);
      if (data.length==0) return res.status(404).json("User not found!")
      // check pw
      const isPasswordBcrypt = bcrypt.compareSync(req.body.password, data[0].password);
      const isPasswordDB = (req.body.password == data[0].password);
      
      if(!isPasswordBcrypt && !isPasswordDB) return res.status(400).json("wrong username or password");
      const token = jwt.sign({id:data[0].user_id},"jwtkey");
      const {password, ...other} = data[0];
      
      res.cookie("access_token", token, {
        httpOnly:true,
        secure: true,
        sameSite: 'None'
      }).status(200).json(other);
      
    });
};



export const logout =(req,res) =>{
    
};