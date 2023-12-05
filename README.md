# Khrouy Auction Website

Project Designed For auction Websites that suitable for specific group of members to use.

Build with Node.js, React and Express

Served in Google Compute engine, Debian, and Apache 2 



## Teams

Master Branch:

Tairan Ren + Yi Zheng--> Frame, Home, Product, User, Login, Register and Post pages 

Chatbot branch:

Yidan Cong --> Chat page, admin and normal users, NLP using OpenAPI 

AdminFunctions branch:

Quan Yuan --> Admin login, Admin Home page, and Admin Functions



## Database Design

### EER 

![](https://i.postimg.cc/dVjwtYV6/eer-diagram-1-0.png)

Major Entities :

Users --> Normal User, Manager, Admin etc.,

Product --> Dimensional Attributes etc.,

Bidding --> bids, users etc.,

Orders --> payment, shipping, etc., 

### Relational Schema

![](https://i.postimg.cc/P5pYBSfd/RELATION-DIAGRAM.png)

Dimension tables providing perspectives that observing the situations

### Triggers, functions, views

examples: 

``` mysql
CREATE FUNCTION GetHighestBidForSession(bid_session VARCHAR(255)) 
RETURNS DECIMAL(10, 2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE highest_bid DECIMAL(10, 2);

    SELECT MAX(price) INTO highest_bid
    FROM `Bids`
    WHERE bid_session_id = bid_session;

    RETURN highest_bid;
    
CREATE FUNCTION assign_manager()
RETURNS CHAR(4) DETERMINISTIC
BEGIN
    DECLARE managerWithFewestUsers CHAR(4);

    SELECT manager_id INTO managerWithFewestUsers
    FROM Manager
    ORDER BY num_of_users ASC, manager_id ASC -- Ensure consistent results
    LIMIT 1;

    RETURN managerWithFewestUsers;
```

```mysql
DELIMITER //
CREATE TRIGGER after_manager_insert
AFTER INSERT ON Manager
FOR EACH ROW
BEGIN
    UPDATE Admins
    SET num_of_managers = num_of_managers + 1
    WHERE admin_id = NEW.admin_id;
END //

CREATE TRIGGER after_user_insert
AFTER INSERT ON USER
FOR EACH ROW
BEGIN
    UPDATE Manager
    SET num_of_users = num_of_users + 1
    WHERE manager_id = NEW.manager_id;
END //
```

```mysql
CREATE VIEW UsersWithBids AS 
SELECT DISTINCT 
    u.user_id,
    u.user_name
FROM 
    `User` u
JOIN 
    `Bids` b ON u.user_id = b.user_id;
```

For all info, check master branch

### Statistical Queries:

 

```mysql
SELECT 
  user_id,
  bid_count
FROM 
  (
    SELECT 
      b.user_id,
      COUNT(DISTINCT b.bid_id) AS bid_count
    FROM 
      bids b
    WHERE 
      b.create_time BETWEEN 
        (
          SELECT MAX(b2.create_time) - INTERVAL 7 DAY 
          FROM bids b2 
          WHERE b2.user_id = b.user_id
        ) AND 
        (
          SELECT MAX(b2.create_time) 
          FROM bids b2 
          WHERE b2.user_id = b.user_id
        )
    GROUP BY 
      b.user_id
  ) AS subquery
WHERE 
  bid_count > 1;
```

```mysql
SELECT val
      FROM
        (SELECT
          sq.year,
          sq.month,
          SUM(sq.monthly_revenue) OVER (ORDER BY sq.year, sq.month) AS val
        FROM
          (SELECT
              YEAR(o.create_time) AS year,
              MONTH(o.create_time) AS month,
              SUM(oc.final_price) AS monthly_revenue
          FROM
            \`order\` o
          JOIN
              order_creation oc ON o.order_id = oc.order_id
          WHERE 
              YEAR(o.create_time) = ? -1
          GROUP BY
              YEAR(o.create_time),
              MONTH(o.create_time)
          ) AS sq
        ORDER BY
          sq.year DESC,
          sq.month DESC
        ) t
      LIMIT 1;
```



## System Diagram 

![](https://i.postimg.cc/4yGTT2Rq/system-diagram-1.png)

Front End could be built anywhere, for now, its also build in GCE and using apache web server. 

Client side is built with Node.js, React, SCSS (formats and style)

Using Axios to sent requests to React router and using Express to do redirect requests to databases

```javascript
const response = await axios.get('/orders/bids/${product_id})
// In the backend, created DB connections:
export const dbUser = mysql2.createConnection({ 
    host: "", 
    user: "", 
    password: "", 
    database: "", 
    port:, 
});
//Using express to create endpoints:
express().use("/api/orders",orderRoutes)
//Routing:
express.Router().get("/bids/:id",getBidds)
// SQL and execution:
export const getBidds = (req, res) => { 
    const q = `SELECT * FROM bids b 
    JOIN bidproduct bp 
    ON b.bid_session_id = bp.bid_session_id 
    Building a Bidding Application: Khoury Auction House Group 12
    10
    WHERE bp.product_id = ?;`; 
    db.query(q, [req.params.id], (err, data) => { 
        if (err) return res.json(err); 
        return res.status(200).json(data); 
    });
};
```

## Characteristics

### "end_time" tag

the database doesn’t use deletion to mark an end of any status, instead it uses  "end_time" as the indicator as the end_time is set to a big number, which is constraint by MySQL, is the year 2037, the project uses this time as a status for ongoing, and when it changes, the current timestamp will be passed to change it so that to mark a product is sold, a user is self-deleted, or an order is closed etc,. 

### Front and Back total Separation 

Both ends could actually run without each other, just the data won't be returned, this is easy for testing and avoid each parts interfering with each other.

This is also why frontend wasn't build on GAE, it won't let us apply self generated certificate and key, and it only allows https, without a domain, we sort of have to turn to apache web server. Nginx is also applicable

### React, Node.js and Express

This sort of main stream frameworks it's providing easy managed environment control, powerful tools and a very good way to learn how to do a "nearly" full stack web



### limitations

#### 1. Not using https 

if we have a domain, than it won't be a thing, but for now, kind of have to use http settings

#### 2. Proxy settings 

We should be using proxy in the overall setting files, however, every time we try, there is weird problems in reading the url, so that we used whole url, which is kind of dumb. Maybe this was caused by version issue? 

![](https://i.postimg.cc/13DFMf5H/04837.png)

#### 3. MySQL

In certain part of the functions, mysql don't seem to be the best choice, like, bidding. dealing with streaming requests are so buggy, if we use transactions, it also creates new problems in react, we are assuming this stack is usually with other databases, say, Redis or Mongo DB to do the streaming functions.

## Using the websites

The webs is build on GCE, VM instances :

### Normal User Functions

1. start backend API endpoint services: Go to the /root/proj/api/ and start with yarn 

   ```shell
   cd /root/proj/api 
   yarn start
   ```

   

2. Check apache server status, it should start when you activate the instance and make sure your frontend is build using yarn or npm and sent the files to /var/www/html apache server path.

   ```
   systemctl status apache2
   ```

   if not start :

   ```
   systemctl start apache2
   ```

   

3. Access the sites in any browser using static ip 34.125.1.254 (apply to your changes) you could search for item in home page and see all the unsold items as well, added show bidding checkbox

   ![](https://i.postimg.cc/g07Ftk0M/110036.png)

4. Register and login( available nuid:  123456780 901234567 ):

   ![](https://i.postimg.cc/Lh5G3cpd/register.png[)

   ![](https://i.postimg.cc/tnsfRx5R/login.png)

   ![](https://i.postimg.cc/N9JSw4RP/logined.png)

5. post item : pictures will be upload to server and recorded as url in database 

   ![](https://i.postimg.cc/xJf3nNQk/post.png)

   

   ![](https://i.postimg.cc/ft8jLWW8/posted.png)

6. product page and if you are the uploader you could delete the item, update the item start the bidding and there is the message board:

   ![](https://i.postimg.cc/TpsxbnH6/messageboard.png)

   6.1 bidding, if no bids added in the given time, it will return to unbidding

   6.2 bids can only be higher than the current bidding and will generate orders in user page automatically

   

7. user page only if you are the uploader you could see what you bought

   ![](https://i.postimg.cc/ZWySx01y/userpage.png)

8. Access order page from user page:

   you can add comments , pay if buyer, ship if seller, rate buyer or seller and if there are problems , you could send messages to your specific manager

   

9. Chatbot from normal user side 

   

### Admin functions 

Same sort of login logout system

1. manager home page :

![](https://i.postimg.cc/GBrrd7wz/manager-home.png)

​    if you are admin, you will also see the sales of each manager

   ![](https://i.postimg.cc/HVcT2890/admin.png)

2. Statistics 

![](https://i.postimg.cc/50qp07Wv/usercreation.png)

3. And only the managers and admins could directly delete a user from the database

### Chatbot



Model: “gpt-4-1106-preview”
Process: 

1.	Capture user inquiries.
2.	Process with AI. (Pass the inquiry along with the database schema to OpenAI API.)
3.	SQL generation. (GPT4 interprets the inquiry and formulates the corresponding SQL query.)
4.	Query execution. (Raw query on the database)
5.	Display results.

Capabilities:
1.	Secure password management. (Obscuring all passwords from normal users.)
2.	Searching with keywords, login records, and specific time ranges.

![](https://i.postimg.cc/Xq9ghsQX/chatgpt.png)
