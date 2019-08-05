import Web3 from 'web3';

const REPEAT_CONNECTION_CHECK = 10 * 1000;

const provider = new Web3.providers.WebsocketProvider(process.env.RPC_URL);

const web3 = new Web3();

function checkConnectionHealth() {
  web3.eth.net.isListening().catch(() => {
    connect();

    window.setTimeout(() => {
      checkConnectionHealth();
    }, REPEAT_CONNECTION_CHECK);
  });
}

export function connect() {
  web3.setProvider(provider);
  checkConnectionHealth();
}

export default web3;
