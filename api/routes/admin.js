import express from "express";
import { deleteUser, deleteProduct, getData, numberByCat, numberManaged, managerSells, activeBidders, getMessages, postMessages, getMessagesAdmin, postMessagesAdmin } from "../controller/admin.js";

const router = express.Router();

router.delete("/user", deleteUser);
router.delete("/product", deleteProduct);
router.get("/data/:category/:year", getData);
router.get("/home/bycat", numberByCat)
router.get("/:id/:type", numberManaged)
router.get("/sells", managerSells)
router.get("/bidders", activeBidders)
router.post("/messages", getMessages)
router.post("/adminmsg", getMessagesAdmin)
router.post("/postmsg", postMessages)
router.post("/postadmin", postMessagesAdmin)

export default router;
