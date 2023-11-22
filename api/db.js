import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
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

export const dbUser = (username, password) => {
  return mysql.createConnection({
    host: "localhost",
    user: username,
    password: password,
    database: "test_env",
  });
};
