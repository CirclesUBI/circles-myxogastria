import Web3 from 'web3';

const REPEAT_CONNECTION_CHECK = 10 * 1000;

const provider = new Web3.providers.WebsocketProvider(
  process.env.ETHEREUM_NODE_ENDPOINT,
);

const web3 = new Web3();

let checkInterval;
let connectionChangeCallback;
let isConnected = false;

function connectToProvider() {
  web3.setProvider(provider);
}

function notifyConnectionState(newState) {
  if (!connectionChangeCallback) {
    return;
  }

  connectionChangeCallback(newState);
}

function checkConnectionState() {
  web3.eth.net
    .isListening()
    .then(() => {
      if (!isConnected) {
        isConnected = true;
        notifyConnectionState(isConnected);
      }
    })
    .catch(() => {
      // Try to reconnect ..
      connectToProvider();

      if (isConnected) {
        isConnected = false;
        notifyConnectionState(isConnected);
      }
    });
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
  connectToProvider();

  // Check frequently for connection state from now on
  checkConnectionState();

  if (!checkInterval) {
    checkInterval = window.setInterval(() => {
      checkConnectionState();
    }, REPEAT_CONNECTION_CHECK);
  }
}

export default web3;
