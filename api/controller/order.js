import { db } from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import moment from "moment"

export const getStatusBefore = (req, res) => {
    const q = `SELECT
                    product_id,
                    CASE
                        WHEN end_time NOT IN ('2037-01-19 03:13:07', '1999-09-09 09:09:09') THEN '1'
                        ELSE '0'
                    END AS 'status'
                FROM
                    product p
                WHERE
                    product_id = ?;`;

    const q_1 = `SELECT *
                 FROM 
                 bidproduct
                 WHERE product_id = ?`;

    db.query(q, [req.params.id], (err, data) => {

        if (err) return res.json(err);
        return res.status(200).json(data[0])



    });
};



// need more work on this part after order series ended
export const getStatusBids = (req, res) => {
    const query = `
                SELECT 
                    DISTINCT bp.product_id, 
                    CASE 
                        WHEN b.bid_id IS NOT NULL THEN '1' 
                        ELSE '0' 
                    END AS bid_status
                FROM 
                    bidproduct bp
                LEFT JOIN 
                    bidsession bs ON bp.bid_session_id = bs.bid_session_id
                LEFT JOIN 
                    bids b ON bs.bid_session_id = b.bid_session_id
                WHERE 
                    bp.product_id = ?;
    `;

    db.query(query, [req.params.id], (err, data) => {
        if (err) {
            console.error("Error in getStatusMiddle:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (data.length === 0) {
            return res.status(500).json();
        }


        return res.status(200).json(data[0]);
    });
};

export const createSession = async (req, res) => {
    try {
        //console.log("working");
        const timeD = parseInt(req.body.time, 10); // Ensure timeD is an integer
        const bidSession = "bid" + moment(Date.now()).format("YYYYMMDDHHmmss") + `_${req.body.user_id}`;
        const create_time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        const end_time = moment(Date.now()).add(timeD, 'seconds').format("YYYY-MM-DD HH:mm:ss");

        const insertBidSessionQuery = `INSERT INTO bidsession (bid_session_id, user_id, create_time, end_time) VALUES (?, ?, ?, ?)`;
        const insertBidProductQuery = `INSERT INTO bidproduct (bid_session_id, product_id) VALUES (?, ?)`;

        await db.query(insertBidSessionQuery, [bidSession, req.body.user_id, create_time, end_time]);

        await db.query(insertBidProductQuery, [bidSession, req.body.productId]);

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        await db.rollback(); // Rollback transaction in case of error
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getBidds = (req, res) => {

    const q = `SELECT
                   *
                FROM
                    bids b
                JOIN bidproduct bp ON b.bid_session_id = bp.bid_session_id 
                WHERE
                    bp.product_id = ?;`;

    db.query(q, [req.params.id], (err, data) => {

        if (err) return res.json(err);

        return res.status(200).json(data);

    });
};

export const addBidds = async (req, res) => {
    const selectQuery = `SELECT bid_session_id FROM bidproduct WHERE product_id = ?`;
    const insertQuery = `INSERT INTO bids (bid_id, bid_session_id, user_id, price, create_time) VALUES (?, ?, ?, ?, ?)`;
    const bidId = `${req.body.bidder_id}_` + moment(Date.now()).format("YYYYMMDDHHmmss");
    const createTime = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");


    // Execute the select query
    db.query(selectQuery, [req.body.product_id], (selectErr, selectResult) => {
        if (selectErr) {
            console.error('Error in executing select query:', selectErr);
            return res.status(500).json({ error: "Internal server error." });
        }

        const sessionId = selectResult.length > 0 ? selectResult[0].bid_session_id : null;
        if (!sessionId) {
            console.log('Session ID not found for the given product ID');
            return res.status(404).json({ message: "Session ID not found for the given product ID." });
        }


        // Execute the insert query
        db.query(insertQuery, [bidId, sessionId, req.body.bidder_id, req.body.bidprice, createTime], (insertErr) => {
            if (insertErr) {
                console.error('Error in executing insert query:', insertErr);
                return res.status(500).json({ error: "Internal server error." });
            }


            res.status(201).json({ message: "Bid successfully added." });
        });
    });
};



export const getEndTime = async (req, res) => {
    const q = `SELECT
                b.end_time AS endTime
               FROM bidsession b
               JOIN bidproduct bp ON b.bid_session_id = bp.bid_session_id
               WHERE bp.product_id = ?
               ORDER by endTime DESC;
               `;
    db.query(q, [req.params.id], (err, data) => {
        if (err) {
            console.error("Error in getStatusMiddle:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (data.length === 0) {
            return res.status(200).json({});
        }
        
        return res.status(200).json(data[0]);
    });
};

export const createOrder = async (req, res) => {
    try {
        const order_id = `${req.body.buyer_id}_${moment().format("YYYYMMDDHHmmss")}`;
        const check = `SELECT * FROM order_creation WHERE order_id = ?`;
        const insert = `
            INSERT INTO order_creation (order_id, bid_session_id, final_price, buyer_id, seller_id) 
            VALUES (?, ?, ?, ?, ?)
        `;

        // First, check if the order already exists
        await db.query(check, [order_id], (err, data)=>{
            if (data[0]) {
                return res.status(409)
            } else {
                try {
                    db.query(insert, [order_id, req.body.bid_session_id, req.body.price, req.body.buyer_id, req.body.seller_id]);
                    return res.status(201).send('Order created successfully.');
                } catch (err) {
                    console.error("Error in creating order:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }
            }
        });

        // If the order does not exist, insert it
        
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Error creating order.');
    }
};

export const checkOrderExists = async (req, res) => {
    try {
        const product_id = req.params.id; // Or req.body.product_id based on how it's sent
        const q = `
        SELECT 
            bp.product_id, 
            CASE 
                WHEN oc.order_id IS NOT NULL THEN 'Order Created' 
                ELSE 'No Order'
            END AS order_status
        FROM 
            bidproduct bp
        LEFT JOIN 
            order_creation oc ON bp.bid_session_id = oc.bid_session_id
        WHERE 
            bp.product_id = ?;
        `;
        console.log(product_id);
        db.query(q, [product_id],(err,data)=>{
            if (err) {
                console.error("Error in getStatusMiddle:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (data.length === 0) {
                return res.status(404).send('No matching product found.');
            }
            return res.status(200).json(data[0]);
        });

    
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Error creating order.');
    }
};

export const deletePrvious = async (req, res) => {
    const q = 'SELECT bid_session_id FROM bidproduct WHERE product_id =?';
    const d1 = 'DELETE FROM bidproduct WHERE product_id =?';
    const d2 = 'DELETE FROM bidsession WHERE bid_session_id =?'
    db.query(q, [req.params.id], (err, data) => {
        if (err) {
            console.error("Error in getStatusMiddle:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (data.length === 0) {
            return res.status(500).json({});
        }
        const bid_session_id = data[0].bid_session_id;

        //console.log(bid_session_id)

        db.query(d1,[req.params.id], (err, data) => {
            if (err) {
                console.error("Error in getStatusMiddle:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            //console.log("sucess");
            db.query(d2,[bid_session_id],(err, data) =>{
                if (err) {
                    console.error("Error in getStatusMiddle:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                //console.log("sucess in two steps")
            });
        });
        
    });
    
}

export const updateOrderEndTime = async (req, res) => {
    const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const q = 'UPDATE `order` SET end_time = ? WHERE order_id =?';
    db.query(q, [currentTime, req.body.order_id], (err, data) => {
        if (err) {
            console.error("Error in completing order:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });
}

export const updatePendtime = async (req, res) => {
    const currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const q = 'UPDATE product SET end_time = ? WHERE product_id =?';
    db.query(q, [currentTime, req.params.id], (err, data) => {
        if (err) {
            console.error("Error in getStatusMiddle:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    })
}

export const getOrderEndTime = async (req, res) => {
    const q = 'SELECT * FROM `order` WHERE order_id = ?'

    db.query(q, [req.params.id], (err, data) => {
        if (err) {
            console.error("Error in completing order:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(200).json(data[0])
    
    });
}