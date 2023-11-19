import express from "express"
import { deleteUser, getUser, getUserBought, updateUser } from "../controller/user.js";


const router = express.Router()


router.get("/:id",getUser);
router.get("/product/:id",getUserBought);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

export default router