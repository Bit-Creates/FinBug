require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();

// Middleware
app.use(compression());
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
let dbInitialized = false;
const connectDB = require('./config/db');

// Initialize database connection
const initializeDB = async () => {
    if (!dbInitialized) {
        try {
            await connectDB();
            dbInitialized = true;
            console.log('✅ Database connected successfully');
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            throw error;
        }
    }
};

// Middleware to ensure DB is connected before processing API requests
app.use(async (req, res, next) => {
    if (req.path.startsWith('/api/v1') && !dbInitialized) {
        try {
            await initializeDB();
        } catch (error) {
            return res.status(503).json({
                message: 'Database connection failed',
                error: error.message
            });
        }
    }
    next();
});

// Health check
app.get("/", (_, res) => {
    res.json({
        message: "FinBug API is running",
        status: "ok",
        dbConnected: dbInitialized,
        timestamp: new Date().toISOString()
    });
});

app.get("/api", (_, res) => {
    res.json({
        message: "FinBug API is running",
        status: "ok",
        dbConnected: dbInitialized,
        timestamp: new Date().toISOString()
    });
});

// Load routes
try {
    const authRoutes = require("./routes/authRoutes");
    const incomeRoutes = require("./routes/incomeRoutes");
    const expenseRoutes = require("./routes/expenseRoutes");
    const dashboardRoutes = require("./routes/dashboardRoutes");
    const aiRoutes = require("./routes/aiRoutes");
    const billScanRoutes = require("./routes/billScanRoutes");

    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/income", incomeRoutes);
    app.use("/api/v1/expense", expenseRoutes);
    app.use("/api/v1/dashboard", dashboardRoutes);
    app.use("/api/v1/ai", aiRoutes);
    app.use("/api/v1/bill", billScanRoutes);

    console.log('✅ All routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading routes:', error.message);
}

// 404 handler
app.use((_, res) => {
    res.status(404).json({
        message: 'Route not found',
        availableRoutes: [
            '/api/v1/auth/login',
            '/api/v1/auth/register',
            '/api/v1/income',
            '/api/v1/expense',
            '/api/v1/dashboard',
            '/api/v1/ai',
            '/api/v1/bill'
        ]
    });
});

// Global error handler
app.use((err, _, res, __) => {
    console.error('❌ Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Export for Vercel
module.exports = app;
