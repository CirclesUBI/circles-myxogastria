import Web3 from 'web3';

const provider = new Web3.providers.WebsocketProvider(
  process.env.ETHEREUM_NODE_WS,
  {
    timeout: 30000,
    reconnect: {
      auto: true,
      delay: 5000,
      maxAttempts: 5,
      onTimeout: false,
    },
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 60000,
    },
  },
);

const web3 = new Web3();

let connectionChangeCallback;
let isConnected = false;

function registerEvents() {
  provider.on('connect', () => {
    isConnected = true;
    notifyConnectionState(true);
  });

  provider.on('error', () => {
    isConnected = false;
    notifyConnectionState(false);
  });

  provider.on('end', () => {
    isConnected = false;
    notifyConnectionState(false);
  });
}

function connectToProvider() {
  web3.setProvider(provider);
}

function notifyConnectionState(newState) {
  if (!connectionChangeCallback) {
    return;
  }

  connectionChangeCallback(newState);
}

export function connect(callback) {
  if (isConnected) {
    return;
  }

  // Add callback to subscribe to connection state changes
  if (typeof callback === 'function') {
    connectionChangeCallback = callback;
  }

  // Connect to Blockchain
  registerEvents();
  connectToProvider();
}

export default web3;
