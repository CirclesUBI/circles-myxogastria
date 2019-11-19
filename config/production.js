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
  SAFE_ADDRESS: '0xa3B4082066815573792D07928F15D5558bBDB701',
  PROXY_FACTORY_ADDRESS: '0x11451dFF80dD7d48186D6a3C6493b978EB8dBAc9',
  HUB_ADDRESS: '0xcdaDbD4ce30c763fecBd21ABD2438dddA6f7b6cc',
  SAFE_FUNDER_ADDRESS: '0x812D4e73eB6B8200A62469Ec3249fB02EAC58C91',

  // Graph node
  SUBGRAPH_NAME: 'CirclesUBI/circles-subgraph',
};
