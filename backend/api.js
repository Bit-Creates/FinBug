require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();

// Enable gzip compression
app.use(compression());

// Simple CORS - allow all origins temporarily
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "FinBug API is running", status: "ok" });
});

app.get("/api", (req, res) => {
    res.json({ message: "FinBug API is running", status: "ok" });
});

// Load routes dynamically with error handling
let authRoutes, incomeRoutes, expenseRoutes, dashboardRoutes, aiRoutes, billScanRoutes, connectDB;

try {
    connectDB = require('./config/db');
    // Connect to database (non-blocking)
    if (connectDB) {
        connectDB().catch(err => console.error('Database connection error:', err));
    }
} catch (error) {
    console.error('Error loading database config:', error.message);
}

try {
    authRoutes = require("./routes/authRoutes");
    app.use("/api/v1/auth", authRoutes);
} catch (error) {
    console.error('Error loading auth routes:', error.message);
}

try {
    incomeRoutes = require("./routes/incomeRoutes");
    app.use("/api/v1/income", incomeRoutes);
} catch (error) {
    console.error('Error loading income routes:', error.message);
}

try {
    expenseRoutes = require("./routes/expenseRoutes");
    app.use("/api/v1/expense", expenseRoutes);
} catch (error) {
    console.error('Error loading expense routes:', error.message);
}

try {
    dashboardRoutes = require("./routes/dashboardRoutes");
    app.use("/api/v1/dashboard", dashboardRoutes);
} catch (error) {
    console.error('Error loading dashboard routes:', error.message);
}

try {
    aiRoutes = require("./routes/aiRoutes");
    app.use("/api/v1/ai", aiRoutes);
} catch (error) {
    console.error('Error loading AI routes:', error.message);
}

try {
    billScanRoutes = require("./routes/billScanRoutes");
    app.use("/api/v1/bill", billScanRoutes);
} catch (error) {
    console.error('Error loading bill scan routes:', error.message);
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: err.message
    });
});

// Export the Express app for Vercel
module.exports = app;
