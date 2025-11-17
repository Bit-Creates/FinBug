require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const connectDB = require('../config/db');
const authRoutes = require("../routes/authRoutes");
const incomeRoutes = require("../routes/incomeRoutes");
const expenseRoutes = require("../routes/expenseRoutes");
const dashboardRoutes = require("../routes/dashboardRoutes");
const aiRoutes = require("../routes/aiRoutes");
const billScanRoutes = require("../routes/billScanRoutes");

const app = express();

// Enable gzip compression for faster response times
app.use(compression());

// Configure CORS to allow multiple origins
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.CLIENT_URL === "*") {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '10mb', charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

// Connect to database
connectDB();

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "FinBug API is running", status: "ok" });
});

app.get("/api", (req, res) => {
    res.json({ message: "FinBug API is running", status: "ok" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/bill", billScanRoutes);

// Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Export the Express app for Vercel
module.exports = app;
