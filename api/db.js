import mysql from "mysql2"

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"group12project",
    port: 3306
})

// db.connect(error => {
//     if (error) {
//       console.error('Error connecting to the database:', error);
//       return;
//     }
//     console.log('Connected to the MySQL server.');
//   });
// export const db = mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"000000",
//     database: "test_env",
//     port: 3307 // this is only in my testing env
// })





export const dbUser = (username, password) => {
    return mysql.createConnection({
        host: "localhost",
        user: username,
        password: password,
        database: "test_env"
    });
};