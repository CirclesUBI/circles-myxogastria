module.exports = {
  // Base path
  BASE_PATH: 'http://localhost:8080',

  // Build environment
  NODE_ENV: 'development',

  // Blockchain API URL
  ETHEREUM_NODE_ENDPOINT: 'ws://localhost:8545',

  // Service Endpoints
  RELAY_SERVICE_ENDPOINT: 'http://relay.circles.local',
  USERNAME_SERVICE_ENDPOINT: 'http://api.circles.local',
  GRAPH_NODE_ENDPOINT: 'http://graph.circles.local',

  // Smart Contract addresses
  SAFE_ADDRESS: '0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb',
  PROXY_FACTORY_ADDRESS: '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550',
  HUB_ADDRESS: '0xCfEB869F69431e42cdB54A4F4f105C19C080A601',

  // Graph node
  SUBGRAPH_NAME: 'CirclesUBI/circles-subgraph',
};
