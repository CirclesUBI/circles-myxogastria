import Web3 from 'web3';

const provider = new Web3.providers.WebsocketProvider(
  process.env.ETHEREUM_NODE_WS,
  {
    clientConfig: {
      keepalive: true,
      keepaliveInterval: 60000,
    },
  },
);

const web3 = new Web3();

let connectionChangeCallback;
let isConnected = false;
let isWatching = true;

function registerEvents() {
  provider.on('connect', () => {
    isConnected = true;
    notifyConnectionState(true);
  });

  provider.on('error', () => {
    isConnected = false;
    notifyConnectionState(false);
    connectToProvider();
  });

  provider.on('end', () => {
    isConnected = false;
    notifyConnectionState(false);
    connectToProvider();
  });
}

function restartWatchEvents() {
  if (isWatching) {
    return;
  }

  if (web3._provider.connected) {
    registerEvents();
  } else {
    window.setTimeout(() => {
      restartWatchEvents();
    }, 1000);
  }
}

function connectToProvider() {
  web3.setProvider(provider);
  restartWatchEvents();
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
