import CirclesCore from 'circles-core';

import web3 from '~/services/web3';

const core = new CirclesCore(web3, {
  safeMasterAddress: process.env.SAFE_ADDRESS,
  hubAddress: process.env.HUB_ADDRESS,
  proxyFactoryAddress: process.env.PROXY_FACTORY_ADDRESS,
  usernameServiceEndpoint: process.env.USERNAME_RESOLVER_SERVICE_ENDPOINT,
  relayServiceEndpoint: process.env.RELAY_SERVICE_ENDPOINT,
});

// eslint-disable-next-line no-unused-vars
export async function getSafeAddress(walletAddress) {
  // @TODO: Call core method here
  // should return Gnosis Safe Public Address as string or null
  // when wallet address does not own any safe
  return Promise.resolve(null);
}

// eslint-disable-next-line no-unused-vars
export async function getTrustState(safeAddress) {
  // @TODO: Call core method here
  return Promise.resolve({
    isTrusted: false,
    network: [],
  });
}

// eslint-disable-next-line no-unused-vars
export function predictSafeAddress(walletAddress, nonce) {
  // @TODO: Call core method here
  // should return Gnosis Safe Public Address as string
  return '0x0123456789123456789012345678901234567890';
}

// eslint-disable-next-line no-unused-vars
export async function registerUser(data) {
  // @TODO: Call core method here
  // data contains `username` and `address`
  return Promise.resolve();
}

// eslint-disable-next-line no-unused-vars
export async function deploySafe(walletAddress, nonce) {
  // @TODO: Call core method here
  // should return final Gnosis Safe Public Address as string
  return Promise.resolve();
}
