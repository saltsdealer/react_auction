import express from "express"
import { addProduct, deleteProduct, getProduct, getProductVaguely, getProducts, updateProduct } from "../controller/product.js"

const router = express.Router()

router.get("/",getProducts);
router.get("/:id",getProduct);
router.post("/",addProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);
router.post("/search/",getProductVaguely);



export default router