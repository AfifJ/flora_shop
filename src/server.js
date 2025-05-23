const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const plantRoutes = require('./routes/plantRoutes');
const { publicLimiter } = require('./middleware/rateLimiter');
const initializeDatabase = require('./database/init');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database on startup
async function startServer() {
    try {
        await initializeDatabase();
        console.log('Database initialization completed');
        
        // Middleware
        app.use(helmet({
            contentSecurityPolicy: false // Allow inline styles for documentation
        }));
        app.use(cors());
        app.use(express.json({ limit: '10mb' }));
        app.use(express.urlencoded({ extended: true }));
        app.use(publicLimiter);

        // Serve static files (for documentation assets if needed)
        app.use('/static', express.static(path.join(__dirname, 'public')));

        // Documentation route at root path
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'documentation.html'));
        });

        // API Routes
        app.use('/api/v1/plants', plantRoutes);

        // Health check endpoint
        app.get('/api/v1/health', (req, res) => {
            res.json({
                success: true,
                message: 'Flora Shop API is running',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
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

        app.listen(PORT, () => {
            console.log(`Flora Shop API server is running on port ${PORT}`);
            console.log(`Documentation: http://localhost:${PORT}/`);
            console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
            console.log(`API base URL: http://localhost:${PORT}/api/v1`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
