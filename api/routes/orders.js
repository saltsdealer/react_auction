import express from "express"
import { addBidds, checkOrderExists, createOrder, createSession, deletePrvious, getBidds, getEndTime, getOrderEndTime, getStatusBefore, getStatusBids,  updateOrderEndTime,  updatePendtime } from "../controller/order.js";

const router = express.Router()

router.get("/before/:id",getStatusBefore) 

router.get("/bid_in_session/:id",getStatusBids) 
router.get("/bids/:id",getBidds) 
router.get("/order/:id",checkOrderExists) 
router.get("/time/:id",getEndTime) 
router.get("/order-end-time/:id",getOrderEndTime) 
router.post("/",createSession);
router.post("/add",addBidds);
router.post("/create",createOrder);
router.post("/complete", updateOrderEndTime)
router.post("/update/:id",updatePendtime);
router.delete("/:id",deletePrvious);


export default router;