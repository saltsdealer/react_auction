
-- address
CREATE TABLE ADDRESS_STATES (
    id CHAR(2) PRIMARY KEY,
    state_name VARCHAR(50)
);
-- NUID
CREATE TABLE NUID (
    id CHAR(9) PRIMARY KEY,
    college_name VARCHAR(255)
);

-- age groups 
CREATE TABLE AgeGroups (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- Using AUTO_INCREMENT for automatic ID assignment
    lower_bound INT NOT NULL,
    upper_bound INT NOT NULL
);

CREATE TABLE AuthTypes (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- Using AUTO_INCREMENT for automatic ID assignment
    auth_type VARCHAR(50) NOT NULL
);

CREATE TABLE ProductCategories (
    id CHAR(3) PRIMARY KEY,  -- Assuming 3 characters for abbreviation
    category_name VARCHAR(100)
);

CREATE TABLE Admins (
    admin_id CHAR(4) PRIMARY KEY,           -- Admin ID with 4 digits
    auth_id INT DEFAULT 4,                  -- Authentication ID defaulting to 3
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Create time with default current timestamp
    end_time TIMESTAMP,                     -- End time with no default
    num_of_managers INT DEFAULT 0           -- Number of managers overseen by the admin
);

CREATE TABLE Manager (
    manager_id CHAR(4) PRIMARY KEY,            -- Manager ID with 4 digits
    auth_id INT DEFAULT 3,                     -- Authentication ID defaulting to 3
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Create time with default current timestamp
    end_time TIMESTAMP,                        -- End time with no default
    num_of_users INT DEFAULT 0,                -- Number of users managed
    admin_id CHAR(4),                          -- ID of the admin who oversees the manager
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id) -- Foreign key relationship to Admins table
);

CREATE TABLE `User` (
    user_id VARCHAR(50) PRIMARY KEY,          -- User ID : nuid, for testing data ,all four digits.
    user_name VARCHAR(255) NOT NULL,      -- User's name
    add_id CHAR(2),                           -- ID from Address table
    auth_id INT DEFAULT 2,                -- Authentication ID defaulting to 2
    manager_id CHAR(4),                   -- Manager's ID random from 10 managers
    age_id INT,
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,   -- Time of creation
    end_time TIMESTAMP, 
    address_detail VARCHAR(255),
    -- FOREIGN KEY (user_id) REFERENCES ADDRESS_STATES(id), may consider adding this constrain                       
    FOREIGN KEY (add_id) REFERENCES ADDRESS_STATES(id),  -- Assuming the primary key in Address table is address_id
    FOREIGN KEY (manager_id) REFERENCES Manager(manager_id),
    FOREIGN KEY (age_id) REFERENCES AgeGroups(id),
    FOREIGN KEY (auth_id) REFERENCES AuthTypes(id)     -- Assuming the primary key in AgeGroups table is age_id
);

CREATE TABLE `Session` (
    temp_id VARCHAR(255) PRIMARY KEY,  -- create time + userid
    user_id VARCHAR(50) DEFAULT '0000',
    auth_id INT NOT NULL,
    create_time TIMESTAMP,
    end_time TIMESTAMP
);

CREATE TABLE `BidSession` (
    bid_session_id VARCHAR(255) PRIMARY KEY, -- bid + user_id (CONCAT('bid', user_id))
    user_id VARCHAR(50),
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP DEFAULT '2037-01-19 03:14:07',
    FOREIGN KEY (user_id) REFERENCES `User`(user_id)
);

CREATE TABLE `Bidder` (
    bidder_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    session_id VARCHAR(255),
    bid_session VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES `User`(user_id),
    FOREIGN KEY (session_id) REFERENCES `Session`(temp_id),
    FOREIGN KEY (bid_session) REFERENCES BidSession(bid_session_id)
);


CREATE TABLE `Product` (
    product_id VARCHAR(70) PRIMARY KEY,   -- ('prod' concatenated with timestamp and userid)
    user_id VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    weight DECIMAL(10, 2) NOT NULL,
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    description TEXT,
    prod_id CHAR(3),  -- categories
    address_id CHAR(2),  -- Assuming 2-character state code for address_id
    pname VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES `User`(user_id),
    FOREIGN KEY (prod_id) REFERENCES ProductCategories(id),  -- Assuming a table called ProductCategories with primary key as 'id'
    FOREIGN KEY (address_id) REFERENCES ADDRESS_STATES(id)  -- Assuming a table called ADDRESS_STATES with primary key as 'id'
);

CREATE TABLE `Bids` (
    bid_id VARCHAR(50) PRIMARY KEY, -- userid(bidder) + create_time
    bid_session_id VARCHAR(255),  
    user_id VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES `User`(user_id),
    FOREIGN KEY (bid_session_id) REFERENCES `BidSession`(bid_session_id)
);

CREATE TABLE `BidProduct` (
    bid_session_id VARCHAR(255)PRIMARY KEY,  
    product_id VARCHAR(70),
    FOREIGN KEY (product_id) REFERENCES `Product`(product_id),
    FOREIGN KEY (bid_session_id) REFERENCES `BidSession`(bid_session_id)
);

CREATE TABLE order_creation(
   order_id VARCHAR(255) PRIMARY KEY, -- buyerid + time session ended 
   bid_session_id VARCHAR(255),
   final_price DECIMAL(10, 2),
   buyer_id VARCHAR(50),
   seller_id VARCHAR(50)
);

CREATE TABLE `order`(
   order_id VARCHAR(255) PRIMARY KEY, -- buyerid + seller_id + time session ended 
   seller_rate INT DEFAULT -1,
   buyer_rate INT DEFAULT -1,
   create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   end_time TIMESTAMP NOT NULL DEFAULT '2037-01-19 03:13:07',
   FOREIGN KEY (order_id) REFERENCES `order_creation`(order_id)
);

CREATE TABLE payment(
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   order_id VARCHAR(255), -- buyerid + seller_id + time session ended 
   pay_status TINYINT(1) NOT NULL DEFAULT 0,
   FOREIGN KEY (order_id) REFERENCES `order_creation`(order_id)
);

CREATE TABLE shipping(
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   order_id VARCHAR(255), -- buyerid + seller_id + time session ended 
   ship_status TINYINT(1) NOT NULL DEFAULT 0,
   company VARCHAR(50) DEFAULT 'UPS',
   ship_no VARCHAR(50),
   FOREIGN KEY (order_id) REFERENCES `order_creation`(order_id)
);

CREATE TABLE user_key (
    user_id VARCHAR(50),
    username VARCHAR(255) NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id),
    UNIQUE (username),
    UNIQUE (email),
    FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

CREATE TABLE prod_pic (
    prod_id VARCHAR(255),
    picture VARCHAR(255)
);

CREATE TABLE order_comments (
  id INT NOT NULL AUTO_INCREMENT,
  order_id VARCHAR(255),
  buyer_comment TEXT,
  seller_comment TEXT,
  PRIMARY KEY (id)
);

CREATE TABLE admin_key (
    admin_id VARCHAR(4),
    admin_name VARCHAR(255) NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL,
    PRIMARY KEY (admin_id)
);

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

CREATE TRIGGER after_order_insert
AFTER INSERT ON `order` FOR EACH ROW
BEGIN
    -- Insert a new record into the payment table with default values
    INSERT INTO payment (order_id) VALUES (NEW.order_id);

    -- Insert a new record into the shipping table with default values
    INSERT INTO shipping (order_id) VALUES (NEW.order_id);
    
    INSERT INTO order_comments (order_id) VALUES (NEW.order_id);
END //


CREATE TRIGGER after_order_creation_insert
AFTER INSERT ON order_creation
FOR EACH ROW
BEGIN
    DECLARE bid_end_time TIMESTAMP;

    -- Get the end_time from the BidSession table using the bid_session_id from the newly added row in order_creation
    SELECT end_time INTO bid_end_time FROM BidSession WHERE bid_session_id = NEW.bid_session_id;

    -- Insert a new record into the order table with the newly added order_id and the retrieved end_time as create_time
    INSERT INTO `order` (order_id, create_time) VALUES (NEW.order_id, bid_end_time);
END //


CREATE FUNCTION assign_manager()
RETURNS CHAR(4) DETERMINISTIC
BEGIN
    DECLARE managerWithFewestUsers CHAR(4);

    SELECT manager_id INTO managerWithFewestUsers
    FROM Manager
    ORDER BY num_of_users ASC, manager_id ASC -- Ensure consistent results
    LIMIT 1;

    RETURN managerWithFewestUsers;
END //


CREATE FUNCTION GetAgeGroupId(age INT) RETURNS INT
READS SQL DATA
BEGIN
    DECLARE ageGroupID INT;

    SELECT id INTO ageGroupID
    FROM AgeGroups
    WHERE age BETWEEN lower_bound AND upper_bound
    LIMIT 1;

    RETURN ageGroupID;
END //

CREATE FUNCTION ConcateID(prefix_string VARCHAR(20), nuid CHAR(9)) 
RETURNS VARCHAR(70) 
DETERMINISTIC
NO SQL
BEGIN
    DECLARE result VARCHAR(70);
    
    SET result = CONCAT(prefix_string, nuid);
    
    RETURN result;
END //

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
END //


CREATE FUNCTION RandomNumberLetter() RETURNS VARCHAR(6) 
DETERMINISTIC
BEGIN
    DECLARE Result VARCHAR(6);
    DECLARE RandomLetter1 CHAR(1);
    DECLARE RandomLetter2 CHAR(1);
    DECLARE RandomLetter3 CHAR(1);
    DECLARE RandomNumber1 CHAR(1);
    DECLARE RandomNumber2 CHAR(1);
    DECLARE RandomNumber3 CHAR(1);

    -- Generate random letters (A-Z)
    SET RandomLetter1 = CHAR(FLOOR(65 + RAND() * 26));
    SET RandomLetter2 = CHAR(FLOOR(65 + RAND() * 26));
    SET RandomLetter3 = CHAR(FLOOR(65 + RAND() * 26));

    -- Generate random numbers (0-9)
    SET RandomNumber1 = CAST(FLOOR(RAND() * 10) AS CHAR);
    SET RandomNumber2 = CAST(FLOOR(RAND() * 10) AS CHAR);
    SET RandomNumber3 = CAST(FLOOR(RAND() * 10) AS CHAR);

    -- Concatenate results
    SET Result = CONCAT(RandomNumber1, RandomNumber2, RandomNumber3, RandomLetter1, RandomLetter2, RandomLetter3);

    RETURN Result;
END //


DELIMITER ;

CREATE VIEW ProductsNotSold AS 
SELECT * 
FROM Product 
WHERE end_time = '2037-01-19 03:13:07';

CREATE OR REPLACE VIEW order_view AS
SELECT 
    o.order_id, 
    CASE WHEN o.seller_rate = -1 THEN '' ELSE CAST(o.seller_rate AS CHAR) END AS seller_rate,
    CASE WHEN o.buyer_rate = -1 THEN '' ELSE CAST(o.buyer_rate AS CHAR) END AS buyer_rate,
    o.create_time,
    o.end_time,
    p.pay_status,
    s.ship_status,
    s.company
FROM 
    `order` o
LEFT JOIN 
    payment p ON o.order_id = p.order_id
LEFT JOIN 
    shipping s ON o.order_id = s.order_id;
    
CREATE VIEW UsersWithBids AS 
SELECT DISTINCT 
    u.user_id,
    u.user_name
FROM 
    `User` u
JOIN 
    `Bids` b ON u.user_id = b.user_id;