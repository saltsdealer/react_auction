
import {db} from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

/* 
export const register = (req, res) => {
    //CHECK EXISTING USER
    console.log("it is started");
    const q = "SELECT * FROM user_key WHERE user_id = ? OR email = ?";
    const nuid_check = "SELECT * FROM NUID WHERE user_id = ?";
    
     //this to use when check qualifications 
    
    
    db.query(nuid_check,[req.body.nuid],(err,data) =>{
      console.log("Step1");
      if (err) return res.status(500).json(err);
      if (!data.length) return res.status(409).json("User not in Khrouy College!");
    });
    // (SELECT get_manager_for_assignment()) to assign manager id
    // core register process
    db.query(q, [req.body.user_id, req.body.email], (err, data) => {
      console.log("Step2");
      if (err) {
          console.error("Database error:", err);
          // Send a simple error message instead of the entire error object
          return res.status(500).json({ error: "Internal Server Error" });
      }
      if (data.length) {
          return res.status(409).json({ error: "User already exists!" });
      }
  
      // Hash the password and create a user
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
  
      const insertQuery = "INSERT INTO user_key (`user_id`, `password`, `username`, `email`) VALUES (?, ?, ?, ?)";
      const values = [req.body.user_id, hash, req.body.username, req.body.email];
      console.log("Step3");
      db.query(insertQuery, values, (err, result) => {
          if (err) {
              console.error("Insert error:", err);
              return res.status(500).json({ error: "Error adding user" });
          }
          res.status(200).json({ message: "User has been created on step 1." });
      });
    });

    db.query("SELECT get_manager_for_assignment() AS manager_id", (err, data) => {
      console.log("Step4");
      if (err) {
          console.error("Database error:", err);
          // Send a simple error message instead of the entire error object
          return res.status(500).json({ error: "Internal Server Error" });
      }
  
      const managerId = data[0].manager_id;
      const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const addUserQuery = "INSERT INTO `User` (`user_id`, `user_name`, `add_id`, `manager_id`, `create_time`, `end_time`, `address_detail`) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [req.body.user_id, req.body.userName, req.body.state, managerId, currentTime, "2037-01-19 03:13:07", req.body.address];
      
      db.query(addUserQuery, [values], (err, result) => {
          if (err) {
              console.error("Insert error:", err);
              return res.status(500).json({ error: "Error adding user" });
          }
          return res.status(200).json({ message: "User has been created" });
      });
    });
  };
*/

export const register = async (req, res) => {
  try {
      console.log("it is started");

      // Check if NUID exists
      const nuid_check = "SELECT * FROM NUID WHERE id = ?";
      const nuidData = await queryDB(nuid_check, [req.body.user_id]);
      console.log(nuidData);
      if (!nuidData.length) {
          return res.status(409).json( "User not in Khrouy College!" );
      }

      // Check if user already exists
      const q = "SELECT * FROM user_key WHERE user_id = ? OR email = ?";
      const userData = await queryDB(q, [req.body.user_id, req.body.email]);
      if (userData.length) {
          return res.status(409).json( "User already exists!" );
      }
      // Assign manager id
      const managerQuery = "SELECT assign_manager() AS manager_id";
      const managerData = await queryDB(managerQuery);
      const managerId = managerData[0].manager_id;
      console.log(managerData);
      // Add user with manager id
      const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const addUserQuery = "INSERT INTO `User` (`user_id`, `user_name`, `add_id`, `manager_id`, `create_time`, `end_time`, `address_detail`) VALUES (?, ?, ?, ?, ?, ?, ?)";
      await queryDB(addUserQuery, [req.body.user_id, req.body.username, req.body.state, managerId, currentTime, "2037-01-19 03:13:07", req.body.address]);
      
      // Hash password and create user
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const insertQuery = "INSERT INTO user_key (`user_id`, `password`, `username`, `email`) VALUES (?, ?, ?, ?)";
      await queryDB(insertQuery, [req.body.user_id, hash, req.body.username, req.body.email]);

      res.status(200).json("User has been created");
  } catch (err) {
      console.error("Error:", err);
      res.status(500).json( "Internal Server Error" );
  }
  // after login there needs to add a session create time as well 
};

// Helper function to convert db.query to a Promise
function queryDB(query, values) {
  return new Promise((resolve, reject) => {
      db.query(query, values, (err, data) => {
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
}


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
    res.clearCookie("access_token",{
      sameSite : "none",
      secure : true
    }).status(200).json("user have been logout");
    // section end time 
};