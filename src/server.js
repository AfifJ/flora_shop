const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const plantRoutes = require('./routes/plantRoutes');
const { publicLimiter } = require('./middleware/rateLimiter');
const initializeDatabase = require('./database/init');

const app = express(); // Define app instance globally for export

// Function to setup the app (middleware, routes)
async function setupApp(appInstance) {
    try {
        await initializeDatabase();
        console.log('Database initialization completed');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        // Depending on the app's requirements, you might want to throw this error
        // or handle it in a way that the app can still start in a degraded mode.
    }

    // Middleware
    appInstance.use(helmet({
        contentSecurityPolicy: false // Allow inline styles for documentation
    }));
    appInstance.use(cors());
    appInstance.use(express.json({ limit: '10mb' }));
    appInstance.use(express.urlencoded({ extended: true }));
    appInstance.use(publicLimiter);

    // Serve static files (for documentation assets if needed)
    // This might be handled by Netlify's publish directory directly.
    // appInstance.use('/static', express.static(path.join(__dirname, 'public')));

    // Documentation route at function root
    appInstance.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'documentation.html'));
    });

    // API Routes - handle both /api/v1 and /v1 patterns
    appInstance.use('/api/v1/plants', plantRoutes);
    appInstance.use('/v1/plants', plantRoutes);

    // Health check endpoint - handle both patterns
    appInstance.get('/api/v1/health', (req, res) => {
        res.json({
            success: true,
            message: 'Flora Shop API is running',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    });
    
    appInstance.get('/v1/health', (req, res) => {
        res.json({
            success: true,
            message: 'Flora Shop API is running',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    });

    // 404 handler for routes not matched within the function
    appInstance.use('*', (req, res) => {
        res.status(404).json({
            success: false,
            error: {
                code: 'FUNCTION_ENDPOINT_NOT_FOUND',
                message: 'The requested endpoint was not found within the API function'
            }
        });
    });

    // Global error handler
    appInstance.use((error, req, res, next) => {
        console.error('Unhandled error in function:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_FUNCTION_ERROR',
                message: 'An unexpected error occurred within the API function'
            }
        });
    });
    return appInstance;
}

const PORT = process.env.PORT || 3000;

// Local server startup logic
if (require.main === module) {
    (async () => {
        try {
            // For local development, create a new app instance and configure it
            const localApp = await setupApp(express());
            localApp.listen(PORT, () => {
                console.log(`Flora Shop API server is running on port ${PORT}`);
                // Updated local URLs based on new routing structure
                console.log(`Documentation (local): http://localhost:${PORT}/`);
                console.log(`Health check (local): http://localhost:${PORT}/v1/health`);
                console.log(`API base URL (local): http://localhost:${PORT}/v1`);
            });
        } catch (error) {
            console.error('Failed to start local server:', error);
            process.exit(1);
        }
    })();
}

// Export the global app instance and the setup function for Netlify
module.exports = { app, setupApp };
