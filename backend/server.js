import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/auth/me", authenticateUser, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to A2Z API"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully",
            databaseTime: result.rows[0].now
        });
    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(`A2Z server running on port ${PORT}`);
});