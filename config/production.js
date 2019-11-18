module.exports = [
  'BASE_PATH',
  'NODE_ENV',
  'ETHEREUM_NODE_ENDPOINT',
  'RELAY_SERVICE_ENDPOINT',
  'USERNAME_SERVICE_ENDPOINT',
  'GRAPH_NODE_ENDPOINT',
  'SAFE_ADDRESS',
  'PROXY_FACTORY_ADDRESS',
  'HUB_ADDRESS',
  'SAFE_FUNDER_ADDRESS',
  'SUBGRAPH_NAME',
].reduce((acc, key) => {
  acc[key] = process.env[key];
  return acc;
}, {});
