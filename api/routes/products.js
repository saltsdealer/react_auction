import express from "express"
import { addProduct } from "../controller/product.js"

const router = express.Router()

router.get("/test",addProduct)

export default router