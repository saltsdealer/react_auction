import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "test_env",
  port: 3306, // this is only in my testing env
});

// export const db = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database: "test_env",
//     port: 3306, // this is only in my testing env
//     socketPath: "/tmp/mysql.sock"
// })

export const dbUser = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "test_env",
  port: 3306, // this is only in my testing env
});
