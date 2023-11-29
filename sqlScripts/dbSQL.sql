-- 8.x mysql
-- user adding products and perhaps all the isnerting model
-- this is only part of the sqls, for the whole picture, check the orginal codes
SET @userId = '123456789';
SET @price = 100.00;
SET @weight = 5.00;
SET @description = 'dyson hair dryer';
SET @prodId = 'APL';
SET @addressId = 'TX'; -- example state code for Texas
SET @productId = CONCAT('prod', UNIX_TIMESTAMP(), @userId);
SET @sql = CONCAT('INSERT INTO Product (product_id, user_id, price, weight, description, prod_id, address_id) VALUES (\'', @productId, '\', ?, ?, ?, ?, ?, ?)');
PREPARE stmt FROM @sql;
EXECUTE stmt USING @userId, @price, @weight, @description, @prodId, @addressId;
DEALLOCATE PREPARE stmt;

-- Counting the number of products in each category: for now each category has one product
-- this is used in admin home page
SELECT 
    pc.category_name,
    COUNT(p.product_id) AS number_of_products,
    SUM(p.price) AS combined_price
FROM 
    `Product` p
JOIN 
    ProductCategories pc ON p.prod_id = pc.id
GROUP BY 
    pc.category_name
ORDER BY 
    combined_price DESC;

--quartely retrive data: 
SELECT
        YEAR(months.month_start) AS year,
        MONTH(months.month_start) AS month,
        COUNT(DISTINCT user_id) AS val
      FROM
        (SELECT 
            CONCAT(YEAR(create_time), '-', LPAD(MONTH(create_time), 2, '0'), '-01') AS month_start,
            LAST_DAY(create_time) AS month_end
        FROM 
            User
        Where YEAR(create_time) = ?
        GROUP BY 
            month_start, month_end) AS months
      JOIN 
        User ON (create_time <= months.month_end AND (end_time IS NULL OR end_time > months.month_start))
      GROUP BY
        year,
        month
      ORDER BY
        year,
        month;

-- Finding the maximum or minimum sold product price in each category: angain, only 7 sold so seven data, with toys has max price at 120.5
-- this was not used in actuall setting
SELECT 
    pc.id AS category_id,
    pc.category_name,
    MAX(oc.final_price) AS max_price
FROM 
    order_creation oc 
JOIN 
    BidProduct bp ON oc.bid_session_id = bp.bid_session_id
JOIN 
    Product p ON bp.prodcut_id = p.product_id
JOIN 
    ProductCategories pc ON p.prod_id = pc.id
GROUP BY 
    pc.id, pc.category_name;


-- Finding the total sales for each manager’s users: as 0005 would have most sells
-- this is used in admin home page
SELECT 
    u.manager_id,
    SUM(oc.final_price) AS total_sales
FROM 
    `User` u
JOIN 
    order_creation oc ON u.user_id = oc.buyer_id
GROUP BY 
    u.manager_id
ORDER BY 
    total_sales DESC;
    
--  order ending cycle (time consumed from creating bidding session to order ending) as testing data are setting to current time stamp, so above 20 days
-- this is not used 
SELECT 
    o.order_id,
    bs.bid_session_id,
    TIMESTAMPDIFF(DAY, bs.create_time, o.end_time) AS elapsed_time_days
FROM 
    `order` o
JOIN 
    order_creation oc ON o.order_id = oc.order_id
JOIN 
    BidSession bs ON oc.bid_session_id = bs.bid_session_id;

-- active bidders, more then one bids in 7 days 012345679 3bids, 124567890 2 bids 789012345 2bids
-- this is used in admin home page
SELECT 
    user_id,
    bid_count
FROM 
    (
        SELECT 
            b.user_id,
            COUNT(DISTINCT b.bid_id) AS bid_count
        FROM 
            `Bids` b
        WHERE 
            b.create_time BETWEEN 
            (
		SELECT MAX(b2.create_time) - INTERVAL 7 DAY 
		FROM `Bids` b2 
		WHERE b2.user_id = b.user_id) AND 
		(
			SELECT MAX(b2.create_time) 
			FROM `Bids` b2 
			WHERE b2.user_id = b.user_id
		)
        GROUP BY 
            b.user_id
    ) AS subquery
WHERE 
    bid_count > 1;

-- Finding the states that bought highest amount of products. 1 Pennsylvania
-- this is not used 
SELECT 
    a.state_name,
    sub.total_amount
FROM 
    (
        SELECT 
            u.add_id,
            SUM(oc.final_price) AS total_amount
        FROM 
            order_creation oc
        JOIN `User` u ON oc.buyer_id = u.user_id
        GROUP BY 
            u.add_id
    ) AS sub
JOIN ADDRESS_STATES a ON a.id = sub.add_id
ORDER BY 
    sub.total_amount DESC
LIMIT 1;

-- top 3 states 1 pennsylvania 2 washington 3 Illinois
-- this is not used 
WITH RankedStates AS (
    SELECT 
        a.state_name,
        SUM(oc.final_price) AS total_amount,
        RANK() OVER(ORDER BY SUM(oc.final_price) DESC) AS rnk
    FROM 
        order_creation oc
    JOIN `User` u ON oc.buyer_id = u.user_id
    JOIN ADDRESS_STATES a ON u.add_id = a.id
    GROUP BY 
        a.state_name
)

SELECT 
    state_name, 
    total_amount
FROM 
    RankedStates
WHERE 
    rnk <= 3;

