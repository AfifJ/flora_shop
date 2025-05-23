const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import routes and middleware
const plantRoutes = require('../src/routes/plantRoutes');
const { publicLimiter } = require('../src/middleware/rateLimiter');

const app = express();

// Middleware
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(publicLimiter);

// Documentation route at root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'views', 'documentation.html'));
});

// API Routes
app.use('/api/v1/plants', plantRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.json({
        success: true,
        message: 'Flora Shop API is running on Vercel',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: 'production'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'ENDPOINT_NOT_FOUND',
            message: 'The requested endpoint was not found'
        }
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred'
        }
    });
});

// Export for Vercel
module.exports = app;
