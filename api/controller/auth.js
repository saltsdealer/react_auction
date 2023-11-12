
import {db} from "../db.js"
import bcrypt from "bcryptjs"

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
    
};

export const logout =(req,res) =>{
    
};