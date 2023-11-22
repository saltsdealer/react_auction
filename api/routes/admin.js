import express from "express"
import { deleteUser, deleteProduct } from "../controller/admin.js"

const router = express.Router()

router.delete("/user",deleteUser)
router.delete("/product",deleteProduct)

export default router