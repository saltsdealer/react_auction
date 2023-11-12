import mysql from "mysql"

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"000000",
    database: "test_env",
    port: 3307 // this is only in my testing env
})





export const dbUser = (username, password) => {
    return mysql.createConnection({
        host: "localhost",
        user: username,
        password: password,
        database: "test_env"
    });
};