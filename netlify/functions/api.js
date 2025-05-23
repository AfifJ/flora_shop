const serverless = require('serverless-http');
// Import the app instance and setupApp function from your main server file
const { app, setupApp } = require('../../src/server');

let serverlessHandlerInstance;

// Main handler for Netlify Function
module.exports.handler = async (event, context) => {
  // Initialize and configure the app only on cold starts
  if (!serverlessHandlerInstance) {
    console.log('Cold start: Initializing and configuring Express app for Netlify function.');
    const configuredApp = await setupApp(app); // Use the imported app instance
    serverlessHandlerInstance = serverless(configuredApp);
    console.log('Express app configured and serverless handler created.');
  } else {
    console.log('Warm start: Reusing existing serverless handler.');
  }

  // Pass the event and context to the serverless-http handler
  return serverlessHandlerInstance(event, context);
};
