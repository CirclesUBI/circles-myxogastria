import Web3 from 'web3';
import HttpProvider from 'web3-providers-http';

var options = {
  timeout: 30000, // ms
  keepAlive: true,
};

const web3 = new Web3(
  new HttpProvider(process.env.ETHEREUM_NODE_ENDPOINT, options),
);

export default web3;
