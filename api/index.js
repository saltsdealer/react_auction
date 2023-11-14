import express  from "express"
import productRoutes from "./routes/products.js"
import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import cors from 'cors'
import cookieParser  from "cookie-parser"

const app = express()
app.use(cors({ origin: 'http://localhost:3000', credentials: true, }));
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/products",productRoutes)

app.get("/test",(req,res)=>{
    res.json("It works!")
})

app.listen(8800,()=>{
    console.log("Connected!")
})