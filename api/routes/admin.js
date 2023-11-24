import express from "express";
import { deleteUser, deleteProduct, getData } from "../controller/admin.js";

const router = express.Router();

router.delete("/user", deleteUser);
router.delete("/product", deleteProduct);
router.get("/data/:category/:year", getData);

export default router;
