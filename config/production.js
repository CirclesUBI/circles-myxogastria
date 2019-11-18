module.exports = {
  // Base path
  BASE_PATH: 'https://circles.garden',

  // Build environment
  NODE_ENV: 'production',

  // Blockchain API URL
  ETHEREUM_NODE_ENDPOINT:
    'wss://kovan.infura.io/ws/v3/0a9d453d25754d52973ee1a69ea37937',

  // Service Endpoints
  RELAY_SERVICE_ENDPOINT: 'https://relay.circles.garden',
  USERNAME_SERVICE_ENDPOINT: 'https://api.circles.garden',
  GRAPH_NODE_ENDPOINT: 'https://graph.circles.garden',

  // Smart Contract addresses
  SAFE_ADDRESS: '0x3a9AdAb04899e3E7D4cf5b280292565c50E089eE',
  PROXY_FACTORY_ADDRESS: '0x99CD11810B7D9F4510554af8a38c694b72eb423A',
  HUB_ADDRESS: '0xEe3E07092eA9a6f705c2b69F51119BB8A9471305',
  SAFE_FUNDER_ADDRESS: '0x812D4e73eB6B8200A62469Ec3249fB02EAC58C91',

  // Graph node
  SUBGRAPH_NAME: 'CirclesUBI/circles-subgraph',
};
