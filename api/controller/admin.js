import { db } from "../db.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import bcrypt from "bcryptjs";

export const deleteUser = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json("Not authenticated!");
    }

    jwt.verify(token, "adminkey");

    const userId = req.body.userId;
    console.log(userId);
    // delete in user table
    const result = await db.query("DELETE FROM `user` WHERE user_id = ?", [
      userId,
    ]);
    // delete in user_key table
    const result_key = await db.query(
      "DELETE FROM user_key WHERE user_id = ?",
      [userId]
    );
    // add in cancelled_users table
    const result_add = await db.query(
      "INSERT INTO cancelled_users (user_id) VALUE ( ? )",
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json("No such user exists!");
    }

    return res.json("User has been deleted!");
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json("Token is not valid!");
    } else {
      return res.status(500).json(err.message);
    }
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json("Not authenticated!");
    }

    jwt.verify(token, "adminkey");

    const productId = req.body.productId;

    // Delete from prod_pic table
    await db.query("DELETE FROM prod_pic WHERE prod_id = ?", [productId]);

    // Update product table
    const result = await db.query(
      "DELETE FROM product WHERE `product_id` = ?",
      [productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json("No such product exists!");
    }

    return res.json("Product has been deleted!");
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(403).json("Token is not valid!");
    } else {
      return res.status(500).json(err.message);
    }
  }
};
