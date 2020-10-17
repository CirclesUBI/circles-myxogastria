import Web3 from 'web3';

const provider = new Web3.providers.HttpProvider(
  process.env.ETHEREUM_NODE_ENDPOINT,
);

const web3 = new Web3();

let connectionChangeCallback;
let isConnected = false;

function registerEvents() {
  notifyConnectionState(true);
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
