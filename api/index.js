import express from "express";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import adminRoutes from "./routes/admin.js";
import orderRoutes from "./routes/orders.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/products",productRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth/admin", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

app.get("/test", (req, res) => {
  res.json("It works!");
});

app.listen(8800, () => {
  console.log("Connected!");
});
