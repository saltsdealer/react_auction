import mysql from "mysql";
import mysql2 from "mysql2"


export const db = mysql.createConnection({
  host: "34.125.1.254",
  user: "root",
  password: "some_pass",
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

export const dbUser = mysql2.createConnection({
  host: "34.125.1.254",
  user: "root",
  password: "some_pass",
  database: "test_env",
  port: 3306, // this is only in my testing env
});
