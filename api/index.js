const { setupApp } = require('../src/server');
const express = require('express');

// Create and configure the app once
let configuredApp;

module.exports = async (req, res) => {
  // Initialize the app only once
  if (!configuredApp) {
    const app = express();
    configuredApp = await setupApp(app);
  }
  
  // Handle the request using our configured Express app
  return configuredApp(req, res);
};
