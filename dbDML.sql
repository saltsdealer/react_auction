INSERT INTO ADDRESS_STATES (id, state_name) VALUES 
('AL', 'Alabama'),
('AK', 'Alaska'),
('AZ', 'Arizona'),
('AR', 'Arkansas'),
('CA', 'California'),
('CO', 'Colorado'),
('CT', 'Connecticut'),
('DE', 'Delaware'),
('FL', 'Florida'),
('GA', 'Georgia'),
('HI', 'Hawaii'),
('ID', 'Idaho'),
('IL', 'Illinois'),
('IN', 'Indiana'),
('IA', 'Iowa'),
('KS', 'Kansas'),
('KY', 'Kentucky'),
('LA', 'Louisiana'),
('ME', 'Maine'),
('MD', 'Maryland'),
('MA', 'Massachusetts'),
('MI', 'Michigan'),
('MN', 'Minnesota'),
('MS', 'Mississippi'),
('MO', 'Missouri'),
('MT', 'Montana'),
('NE', 'Nebraska'),
('NV', 'Nevada'),
('NH', 'New Hampshire'),
('NJ', 'New Jersey'),
('NM', 'New Mexico'),
('NY', 'New York'),
('NC', 'North Carolina'),
('ND', 'North Dakota'),
('OH', 'Ohio'),
('OK', 'Oklahoma'),
('OR', 'Oregon'),
('PA', 'Pennsylvania'),
('RI', 'Rhode Island'),
('SC', 'South Carolina'),
('SD', 'South Dakota'),
('TN', 'Tennessee'),
('TX', 'Texas'),
('UT', 'Utah'),
('VT', 'Vermont'),
('VA', 'Virginia'),
('WA', 'Washington'),
('WV', 'West Virginia'),
('WI', 'Wisconsin'),
('WY', 'Wyoming');

INSERT INTO NUID (id, college_name) VALUES 
('123456789', 'Khrouy'),
('234567890', 'Khrouy'),
('345678901', 'Khrouy'),
('456789012', 'Khrouy'),
('567890123', 'Khrouy'),
('678901234', 'Khrouy'),
('789012345', 'Khrouy'),
('890123456', 'Khrouy'),
('901234567', 'Khrouy'),
('012345678', 'Khrouy'),
('123456780', 'Khrouy'),
('234567891', 'Khrouy'),
('345678902', 'Khrouy'),
('456789013', 'Khrouy'),
('567890124', 'Khrouy'),
('678901235', 'Khrouy'),
('789012346', 'Khrouy'),
('890123457', 'Khrouy'),
('901234568', 'Khrouy'),
('012345679', 'Khrouy'),
('123456781', 'Khrouy'),
('234567892', 'Khrouy'),
('345678903', 'Khrouy'),
('456789014', 'Khrouy'),
('567890125', 'Khrouy'),
('678901236', 'Khrouy'),
('789012347', 'Khrouy'),
('890123458', 'Khrouy'),
('901234569', 'Khrouy');

INSERT INTO AgeGroups (lower_bound, upper_bound) VALUES 
(0, 5),
(6, 10),
(11, 15),
(16, 20),
(21, 25),
(26, 30),
(31, 35),
(36, 40),
(41, 45),
(46, 50);

INSERT INTO AuthTypes (auth_type) VALUES 
('viewer'),
('user'),
('manager'),
('admin');

INSERT INTO ProductCategories (id, category_name) VALUES 
('ELC', 'Electronics'),
('APL', 'Appliances'),
('BKS', 'Books'),
('APP', 'Apparel'),
('FOD', 'Food'),
('FRN', 'Furniture'),
('SPT', 'Sports Equipment'),
('TOY', 'Toys'),
('HLH', 'Health & Beauty'),
('JWL', 'Jewelry');

INSERT INTO Admins (admin_id, create_time, end_time) VALUES 
('1001', '2023-04-15 10:05:12', '2037-01-19 03:13:07'),
('1002', '2023-06-24 14:07:34', '2037-01-19 03:13:07'),
('1003', '2023-08-02 16:45:56', '2037-01-19 03:13:07'),
('1004', '2023-10-10 18:23:12', '2037-01-19 03:13:07');

INSERT INTO Manager (manager_id, create_time, end_time, admin_id) VALUES 
('0001', '2023-04-01 10:00:00', '2037-01-19 03:13:07', '1001'),
('0002', '2023-04-02 11:15:00', '2037-01-19 03:13:07', '1001'),
('0003', '2023-04-03 12:30:00', '2037-01-19 03:13:07', '1002'),
('0004', '2023-04-04 13:45:00', '2037-01-19 03:13:07', '1002'),
('0005', '2023-04-05 14:00:00', '2037-01-19 03:13:07', '1003'),
('0006', '2023-04-06 15:15:00', '2037-01-19 03:13:07', '1003'),
('0007', '2023-04-07 16:30:00', '2037-01-19 03:13:07', '1004'),
('0008', '2023-04-08 17:45:00', '2037-01-19 03:13:07', '1004'),
('0009', '2023-04-09 18:00:00', '2037-01-19 03:13:07', '1001'),
('0010', '2023-04-10 19:15:00', '2037-01-19 03:13:07', '1002');


INSERT INTO `user` (user_id, user_name, add_id, manager_id, age_id, create_time, end_time, address_detail) VALUES 
('123456789', 'Alice Smith', 'CA', '0001', 1, '2022-03-10 14:23:12', '2037-01-19 03:14:06', '123 Main St, Los Angeles, CA'),
('234567890', 'Bob Johnson', 'TX', '0001', 2, '2020-08-05 11:02:45', '2037-01-19 03:13:07', '456 Oak Ave, Dallas, TX'),
('345678901', 'Charlie Brown', 'FL', '0002', 3, '2021-06-15 09:14:05', '2037-01-19 03:13:07', '789 Beach Blvd, Miami, FL'),
('456789012', 'David Williams', 'NY', '0002', 4, '2021-02-17 18:43:58', '2037-01-19 03:13:07', '101 Park Lane, New York, NY'),
('567890123', 'Eve Davis', 'IL', '0003', 1, '2021-10-21 12:35:42', '2037-01-19 03:13:07', '202 Elm St, Chicago, IL'),
('678901234', 'Frank Wilson', 'GA', '0003', 2, '2019-11-03 10:09:54', '2037-01-19 03:13:07', '303 Pine Rd, Atlanta, GA'),
('789012345', 'Grace Jones', 'WA', '0004', 3, '2020-04-04 15:25:01', '2037-01-19 03:13:07', '404 Mountain Way, Seattle, WA'),
('890123456', 'Henry Garcia', 'CO', '0004', 4, '2019-12-12 16:51:02', '2037-01-19 03:13:07', '505 River Rd, Denver, CO'),
('901234568', 'Isabelle Thomas', 'AZ', '0005', 1, '2022-01-20 14:28:37', '2037-01-19 03:13:07', '606 Desert Blvd, Phoenix, AZ'),
('012345679', 'John Rodriguez', 'PA', '0005', 2, '2020-07-13 09:17:59', '2037-01-19 03:13:07', '707 Liberty Ln, Philadelphia, PA'),
('2010', 'Katie Martinez', 'OH', '0006', 3, '2019-05-05 11:45:23', '2037-01-19 03:13:07', '808 Lake Rd, Columbus, OH'),
('2011', 'Louis White', 'MI', '0006', 4, '2021-08-08 08:08:08', '2037-01-19 03:13:07', '909 Forest Dr, Detroit, MI'),
('2012', 'Monica Taylor', 'NC', '0007', 1, '2020-09-21 13:39:47', '2037-01-19 03:13:07', '1010 Hill St, Charlotte, NC'),
('2013', 'Ned Clark', 'CA', '0007', 2, '2022-04-02 17:04:56', '2037-01-19 03:13:07', '1111 Valley Rd, Richmond, CA'),
('2014', 'Olivia Lewis', 'CA', '0008', 3, '2019-03-23 12:15:33', '2037-01-19 03:13:07', '1212 Beach Dr, Newark, CA'),
('2015', 'Paul Young', 'OR', '0008', 4, '2020-06-11 11:11:11', '2037-01-19 03:13:07', '1313 Park Blvd, Portland, OR'),
('2016', 'Quincy Hall', 'MO', '0009', 1, '2021-09-09 19:19:19', '2037-01-19 03:13:07', '1414 Brick Rd, Kansas City, MO'),
('2017', 'Rachel Allen', 'TN', '0009', 2, '2019-04-14 14:14:14', '2037-01-19 03:13:07', '1515 Tree Ln, Nashville, TN'),
('2018', 'Steve Nelson', 'MD', '0010', 3, '2020-12-12 12:12:12', '2037-01-19 03:13:07', '1616 Rose St, Baltimore, MD'),
('2019', 'Tina Wright', 'WI', '0010', 4, '2021-07-17 17:17:17', '2037-01-19 03:13:07', '1717 Snow Rd, Milwaukee, WI');

INSERT INTO `Session` (temp_id, user_id, auth_id, create_time, end_time) VALUES 
('20231101100512_123456789', '123456789', 2, '2023-04-01 10:05:12', '2023-04-01 11:05:12'),
('20231001091500_234567890', '234567890', 2, '2023-10-01 09:15:00', '2023-10-01 09:20:00'),
('20231001092500_234567890', '234567890', 2, '2023-10-01 09:25:00', '2023-10-01 09:35:00'),
('20231001101000_456789012', '456789012', 2, '2023-10-01 10:10:00', '2023-10-01 10:15:00'),
('20231001101500_456789012', '456789012', 2, '2023-10-01 10:15:00', '2023-10-01 10:20:00'),
('20231001102000_567890123', '567890123', 2, '2023-10-01 10:20:00', '2023-10-01 10:25:00'),
('20231105140000_0000', '0000', 1, '2023-04-05 14:00:00', '2023-04-05 14:30:00'),
('20231002142000_678901234', '678901234', 2, '2023-10-02 14:20:00', '2023-10-02 14:25:00'),
('20231107163000_789012345', '789012345', 2, '2023-04-07 16:30:00', '2023-04-07 17:15:00'),
('20231002162500_789012345', '789012345', 2, '2023-10-02 16:25:00', '2023-10-02 16:45:00'),
('20231108174500_0000', '0000', 1, '2023-04-08 17:45:00', '2023-04-08 18:30:00'),
('20231003095500_901234568', '901234568', 2, '2023-10-03 09:55:00', '2023-10-03 09:58:00'),
('20231003101000_012345679', '012345679', 2, '2023-10-03 10:10:00', '2023-10-03 10:20:00');

INSERT INTO `BidSession` (bid_session_id, user_id, create_time, end_time) VALUES
('bid20231001091500_123456789', '123456789', '2023-10-01 09:15:00', '2023-10-01 09:45:00'),
('bid20231001100500_234567890', '234567890', '2023-10-01 10:05:00', '2023-10-01 10:35:00'),
('bid20231002142000_345678901', '345678901', '2023-10-02 14:20:00', '2023-10-02 14:50:00'),
('bid20231002160000_456789012', '456789012', '2023-10-02 16:00:00', '2023-10-02 16:30:00'),
('bid20231003095000_567890123', '567890123', '2023-10-03 09:50:00', '2023-10-03 10:20:00'),
('bid20231004160000_678901234', '678901234', '2023-10-04 16:00:00', '2023-10-04 16:30:00'),
('bid20231005160000_789012345', '789012345', '2023-10-05 16:00:00', '2023-10-05 16:30:00');

INSERT INTO `Bidder` (bidder_id, user_id, bid_session, session_id) VALUES
(CONCAT('234567890', RandomNumberLetter()),'234567890', 'bid20231001091500_123456789', '20231001091500_234567890'),
(CONCAT('456789012', RandomNumberLetter()),'456789012', 'bid20231001091500_123456789', '20231001101000_456789012'),
(CONCAT('456789012', RandomNumberLetter()),'456789012', 'bid20231001100500_234567890', '20231001101500_456789012'),
(CONCAT('567890123', RandomNumberLetter()),'567890123', 'bid20231001100500_234567890', '20231001102000_567890123'),
(CONCAT('678901234', RandomNumberLetter()),'678901234', 'bid20231002142000_345678901', '20231002142000_678901234'),
(CONCAT('789012345', RandomNumberLetter()),'789012345', 'bid20231002142000_345678901', '20231107163000_789012345'),
(CONCAT('789012345', RandomNumberLetter()),'789012345', 'bid20231002160000_456789012', '20231107163000_789012345'),
(CONCAT('901234568', RandomNumberLetter()),'901234568', 'bid20231003095000_567890123', '20231003095500_901234568'),
(CONCAT('012345679', RandomNumberLetter()),'012345679', 'bid20231003095000_567890123', '20231003101000_012345679');

INSERT INTO `Product` 
(product_id, user_id, price, weight, create_time, end_time, description, prod_id, address_id, pname) VALUES
('prod202310270900002000', '123456789', 9.99, 1.5, '2023-9-30 09:15:00', '2023-10-01 09:45:00', 'Latest iPhone', 'ELC', 'CA', "iphone"),
('prod202310271000002001', '234567890', 299.99, 1.0, '2023-9-27 10:00:00', '2037-01-19 03:13:07', 'Top Load Washing Machine', 'APL', 'TX',"washing machine"),
('prod202310271100002002', '345678901', 19.99, 0.5, '2023-10-01 11:00:00', '2023-10-02 14:50:00', 'Harry Potter Book Set', 'BKS', 'FL',"HP books"),
('prod202310271200002003', '456789012', 49.99, 0.3, '2023-9-29 12:00:00', '2037-01-19 03:13:07', 'Adidas Running Shoes', 'APP', 'NY',"shoes"),
('prod202310271300002004', '567890123', 5.99, 0.2, '2023-10-01 13:00:00', '2023-10-03 10:20:00', 'Organic Apple Juice', 'FOD', 'IL',"juice"),
('prod202310271400002005', '678901234', 1299.99, 20.0, '2023-10-27 14:00:00', '2023-10-04 16:30:00', 'Leather Sofa Set', 'FRN', 'GA',"sofa"),
('prod202310271500002006', '789012345', 59.99, 2.0, '2023-10-27 15:00:00', '2023-10-05 16:30:00', 'Nike Tennis Racket', 'SPT', 'WA',"racket"),
('prod202310271600002007', '890123456', 24.99, 0.4, '2023-10-27 16:00:00', '2037-01-19 03:13:07', 'Remote Control Car', 'TOY', 'CO',"toy car"),
('prod202310271700002008', '901234568', 14.99, 0.1, '2023-10-27 17:00:00', '2037-01-19 03:13:07', 'Organic Face Cream', 'HLH', 'AZ',"face cream"),
('prod202310271800002009', '012345679', 9999.99, 0.05, '2023-10-27 18:00:00', '2037-01-19 03:13:07', 'Diamond Necklace', 'JWL', 'PA',"necklace");
INSERT INTO `Product` (product_id, user_id, price, weight, create_time, end_time, description, prod_id, address_id, pname) VALUES
('prod202310271800002010','012345679',50,10,'2023-10-27 18:00:00','2037-01-19 03:13:07','90% used, but still very nice coat','APP','CA','Burberry Wind Coat');


INSERT INTO `Bids` (bid_id, bid_session_id, user_id,price, create_time) VALUES
('234567890_20231001091700', 'bid20231001091500_123456789', '234567890',25.2,'2023-10-01 09:17:00'),
('456789012_20231001092000', 'bid20231001091500_123456789', '456789012',30.5,'2023-10-01 09:20:00'),
('567890123_20231001101500', 'bid20231001100500_234567890', '567890123',40.5,'2023-10-01 10:15:00'),
('678901234_20231002142500', 'bid20231002142000_345678901', '678901234',100.0,'2023-10-02 14:25:00'),
('789012345_20231002143000', 'bid20231002142000_345678901', '789012345',120.5,'2023-10-02 14:30:00'),
('789012345_20231002161000', 'bid20231002160000_456789012', '789012345',50.5,'2023-10-02 16:10:00'),
('901234568_20231003095500', 'bid20231003095000_567890123', '901234568',60.5,'2023-10-03 09:55:00'),
('012345679_20231003095800', 'bid20231003095000_567890123', '012345679',70.5,'2023-10-03 09:58:00'),
('012345679_20231004162500', 'bid20231004160000_678901234', '012345679',80.5,'2023-10-04 16:25:00'),
('012345679_20231005162200', 'bid20231005160000_789012345', '012345679',90.5,'2023-10-04 16:22:00');

INSERT INTO `Bids` (bid_id, bid_session_id, user_id,price, create_time) VALUES
('234567890_20231002142000', 'bid20231002142000_345678901', '234567890',25.2,'2023-10-02 14:20:00');

INSERT INTO `BidProduct` (bid_session_id,product_id) VALUES
('bid20231001091500_123456789','prod202310270900002000'),
('bid20231001100500_234567890','prod202310271100002002'),
('bid20231002142000_345678901','prod202310271600002007'),
('bid20231002160000_456789012','prod202310271700002008'),
('bid20231003095000_567890123','prod202310271300002004'),
('bid20231004160000_678901234','prod202310271400002005'),
('bid20231005160000_789012345','prod202310271500002006');

INSERT INTO `order_creation` (order_id, bid_session_id,final_price, buyer_id,seller_id) VALUES
('456789012_20231001094500','bid20231001091500_123456789',30.5,'456789012','123456789'),
('567890123_20231001103500','bid20231001100500_234567890',40.5,'567890123','345678901'),
('789012345_20231002145000','bid20231002142000_345678901',120.5,'789012345','890123456'),
('789012345_20231002163000','bid20231002160000_456789012',50.5,'789012345','901234568'),
('012345679_20231003102000','bid20231003095000_567890123',70.5,'012345679','567890123'),
('012345679_20231004163000','bid20231004160000_678901234',80.5,'012345679','678901234'),
('012345679_20231005163000','bid20231005160000_789012345',90.5,'012345679','789012345');
-- and thus order table will create data automatically

INSERT INTO user_key (user_id, username, PASSWORD, email) VALUES
('123456789', 'a1', 'test', 'a1@gmail.com'),
('234567890', 'a2', 'test', 'a2@gmail.com'),
('345678901', 'a3', 'test', 'a3@gmail.com'),
('456789012','a4','test','b4@gmail.com'),
('567890123','a5','test','b5@gmail.com'),
('678901234','a8','test','b6@gmail.com'),
('789012345','a6','test','b7@gmail.com'),
('890123456','a7','test','b8@gmail.com'),
('901234568','a9','test','b9@gmail.com'),
('012345679', 'a10', 'test', 'a10@gmail.com');

INSERT INTO prod_pic (prod_id, picture) VALUES
('prod202310270900002000','https://i.postimg.cc/bZSqTw60/th.jpg'),
('prod202310271000002001','https://i.postimg.cc/rKKTVpL6/wm.png'),
('prod202310271100002002','https://i.postimg.cc/8syDg69B/hp.png'),
('prod202310271200002003','https://i.postimg.cc/bDgPJDJP/rs.png'),
('prod202310271300002004','..upload/aj.jpg'),
('prod202310271400002005','https://i.postimg.cc/ctJS8xgn/ss.png'),
('prod202310271500002006','https://i.postimg.cc/xkrnFV7w/nt.png'),
('prod202310271600002007','https://i.postimg.cc/v1WMJSwc/rc.png'),
('prod202310271700002008','https://i.postimg.cc/7GwDwMqX/fc.png'),
('prod202310271800002009','https://i.postimg.cc/yW6BGPQ8/dn.png');

INSERT INTO admin_key (admin_id, admin_name, PASSWORD) VALUES
('1001', 'admin1', 'admin'),
('1002', 'admin2', 'admin'),
('1003', 'admin3', 'admin'),
('1004', 'admin4', 'admin'),
('0001', 'manager1', 'manager'),
('0002', 'manager2', 'manager'),
('0003', 'manager3', 'manager'),
('0004', 'manager4', 'manager'),
('0005', 'manager5', 'manager'),
('0006', 'manager6', 'manager'),
('0007', 'manager7', 'manager'),
('0008', 'manager8', 'manager'),
('0009', 'manager9', 'manager'),
('0010', 'manager10', 'manager');

INSERT INTO prod_pic (prod_id, picture) VALUES
('prod202310271800002010','https://i.postimg.cc/0yzd3v7S/bw.png');

-- to test the function specificaly
INSERT INTO USER (user_id, user_name, add_id, manager_id, age_id, create_time, end_time, address_detail)
VALUES ('2020', 'Victor Hugo', 'CA', '0001', GetAgeGroupId(25), '2023-01-15 15:23:45', '2037-01-19 03:13:07', '123 Literary St, Los Angeles, CA');

-- this is testing data only:
UPDATE `order` SET seller_rate = 3 ;
UPDATE `order` SET buyer_rate = 4 ;
UPDATE `order` SET end_time = CURRENT_TIMESTAMP ;


