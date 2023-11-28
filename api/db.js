import mysql from "mysql";
import mysql2 from "mysql2"


export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "000000",
  database: "test_env",
  port: 3307, // this is only in my testing env
});

export const dbChat = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "000000",
  database: "test_env",
  port: 3307,
})

// host:"localhost",
// user:"root",
// password:"0000",
// database:"test_env",
// port: 3307
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

export const dbUser = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "000000",
  database: "test_env",
  port: 3307, // this is only in my testing env
});

export const dbSchema = `
based on the following MySQL 8.0 database schema, each line stands for a table:

1. ADDRESS_STATES: 'id' (CHAR(2), primary key) and 'state_name' (VARCHAR(50)).

2. NUID: 'id' (CHAR(9), primary key) and 'college_name' (VARCHAR(255)).

3. AgeGroups: 'id' (INT, primary key), 'lower_bound' (INT), and 'upper_bound' (INT).

4. AuthTypes: 'id' (INT, primary key) and 'auth_type' (VARCHAR(50)).

5. ProductCategories: 'id' (CHAR(3), primary key) and 'category_name' (VARCHAR(100)).

6. Admins: 'admin_id' (CHAR(4), primary key), 'auth_id' (INT, default 4), 'create_time' (TIMESTAMP, default current timestamp), 'end_time' (TIMESTAMP), and 'num_of_managers' (INT, default 0).

7. Manager: 'manager_id' (CHAR(4), primary key), 'auth_id' (INT, default 3), 'create_time' (TIMESTAMP, default current timestamp), 'end_time' (TIMESTAMP), 'num_of_users' (INT, default 0), and 'admin_id' (CHAR(4), foreign key references Admins(admin_id)).

8. User: 'user_id' (VARCHAR(50), primary key), 'user_name' (VARCHAR(255), not null), 'add_id' (CHAR(2)) references ADDRESS_STATES(id), 'auth_id' (INT, default 2) references AuthTypes(id), 'manager_id' (CHAR(4)) references Manager(manager_id), 'age_id' (INT) references AgeGroups(id), 'create_time' (TIMESTAMP, default current timestamp), 'end_time' (TIMESTAMP), 'address_detail' (VARCHAR(255)).

9. Session: 'temp_id' (VARCHAR(255), primary key), 'user_id' (VARCHAR(50), default '0000'), 'auth_id' (INT, not null), 'create_time' (TIMESTAMP), and 'end_time' (TIMESTAMP).

10. BidSession: 'bid_session_id' (VARCHAR(255), primary key), 'user_id' (VARCHAR(50)) references User(user_id), 'create_time' (TIMESTAMP, default current timestamp), 'end_time' (TIMESTAMP, default '2037-01-19 03:14:07').

11. Bidder: 'bidder_id' (VARCHAR(50), primary key), 'user_id' (VARCHAR(50)) references User(user_id), 'session_id' (VARCHAR(255)) references Session(temp_id), 'bid_session' (VARCHAR(255)) references BidSession(bid_session_id).

12. Product: 'product_id' (VARCHAR(70), primary key), 'user_id' (VARCHAR(50)) references User(user_id), 'price' (DECIMAL(10, 2)), 'weight' (DECIMAL(10, 2)), 'create_time' (TIMESTAMP, default current timestamp), 'end_time' (TIMESTAMP), 'description' (TEXT), 'prod_id' (CHAR(3)) references PruductCategories(id), 'address_id' (CHAR(2)) references ADDRESS_STATES(id), 'pname' (VARCHAR(50)).

13. Bids: 'bid_id' (VARCHAR(50), primary key), 'bid_session_id' (VARCHAR(255)) references BidSession(bid_session_id), 'user_id' (VARCHAR(50)) references User(user_id), 'price' (DECIMAL(10, 2), not null), 'create_time' (TIMESTAMP, default current timestamp), and foreign keys referencing User, BidSession.

14. BidProduct: 'bid_session_id' (VARCHAR(255), primary key) references BidSession(bid_session_id), 'product_id' (VARCHAR(70)) references Product(product_id).

15. order_creation: 'order_id' (VARCHAR(255), primary key), 'bid_session_id' (VARCHAR(255)), 'final_price' (DECIMAL(10, 2)), 'buyer_id' (VARCHAR(50)), 'seller_id' (VARCHAR(50)).

16. \`order\`: 'order_id' (VARCHAR(255), primary key) references order_creation(order_id), 'seller_rate' (INT), 'buyer_rate' (INT), 'create_time' (TIMESTAMP, not null, default CURRENT_TIMESTAMP), 'end_time' (TIMESTAMP, not null, default '2037-01-19 03:13:07').

17. Payment: 'id' (INT, primary key), 'order_id' (VARCHAR(255) references order_creation(order_id)), and 'pay_status' (TINYINT(1), not null, default 0).

18. Shipping: 'id' (INT, primary key), 'order_id' (VARCHAR(255), references order_creation(order_id)), 'ship_status' (TINYINT(1), not null, default 0), and 'company' (VARCHAR(50), default 'UPS').

19. User_Key: 'user_id' (VARCHAR(50), primary key, references USER(user_id)), 'username' (VARCHAR(255), unique), 'password' (VARCHAR(255)), and 'email' (VARCHAR(255), unique).

20. Prod_Pic: 'prod_id' (VARCHAR(255)), and 'picture' (VARCHAR(255)).

Generate an SQL query, select at least one column to present the result, strictly only using the fields in the given database schema, omit the comments, never show the passwords, for the following purpose:

`