require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3();

// Validate required environment variables
const requiredEnvVars = [
  'API_SERVICE_EXTERNAL',
  'SAFE_DEFAULT_CALLBACK_HANDLER',
  'GRAPH_NODE_EXTERNAL',
  'HUB_ADDRESS',
  'PATHFINDER_SERVICE_ENDPOINT',
  'PATHFINDER_TYPE',
  'PROXY_FACTORY_ADDRESS',
  'RELAY_SERVICE_EXTERNAL',
  'SAFE_ADDRESS',
  'SUBGRAPH_NAME',
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Environment variable ${varName} is not set`);
  }
});
