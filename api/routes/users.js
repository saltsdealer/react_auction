import express from "express"
import { deleteUser, getAverageRates, getOrder, getOrderByUser, getReviews, getUser, getUserBought, getUserbyProduct, updateComments, updateRates, updateStatus, updateUser } from "../controller/user.js";


const router = express.Router()


router.get("/:id",getUser);
router.get("/product/:id",getUserBought);
router.get("/order/:id",getOrder);
router.get("/rate/:id",getAverageRates);
router.get("/reviews/:id",getReviews);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
router.post("/rates", updateRates);
router.get("/userByProduct/:id",getUserbyProduct);
router.post("/orderByUser/", getOrderByUser);
router.post("/update-status/", updateStatus);
router.post("/update-comments/", updateComments);
router.post("/update-endtime/:id", updateComments);
export default router