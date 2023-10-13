import { ethers } from 'ethers';

const ethProvider = new ethers.providers.JsonRpcProvider(
  process.env.ETHEREUM_NODE_ENDPOINT,
);

export default ethProvider;
