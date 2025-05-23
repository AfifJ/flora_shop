const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import your routes here - adjust paths as needed
// const plantRoutes = require('../../src/routes/plantRoutes');
// const orderRoutes = require('../../src/routes/orderRoutes');
// etc.

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API routes
app.get('/.netlify/functions/api', (req, res) => {
  res.json({ message: 'Flora Shop API - Running on Netlify Functions' });
});

// Mount your routes here
// app.use('/.netlify/functions/api/plants', plantRoutes);
// app.use('/.netlify/functions/api/orders', orderRoutes);
// etc.

// Export the serverless function
module.exports.handler = serverless(app);
