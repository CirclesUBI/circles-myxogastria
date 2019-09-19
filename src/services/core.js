import CirclesCore from 'circles-core';

import web3 from '~/services/web3';
import { getAccount } from '~/services/wallet';

const core = new CirclesCore(web3, {
  safeMasterAddress: process.env.SAFE_ADDRESS,
  hubAddress: process.env.HUB_ADDRESS,
  proxyFactoryAddress: process.env.PROXY_FACTORY_ADDRESS,
  usernameServiceEndpoint: process.env.USERNAME_RESOLVER_SERVICE_ENDPOINT,
  relayServiceEndpoint: process.env.RELAY_SERVICE_ENDPOINT,
});

export async function prepareSafeDeploy(nonce) {
  const account = getAccount();

  return await core.safe.prepareDeploy(account, {
    nonce,
  });
}

export async function registerUser(nonce, safeAddress, username) {
  const account = getAccount();

  return await core.user.register(account, {
    nonce,
    safeAddress,
    username,
  });
}

export async function deploySafe(safeAddress) {
  const account = getAccount();

  return await core.safe.forceDeploy(account, {
    address: safeAddress,
  });
}

// eslint-disable-next-line no-unused-vars
export async function getTrustNetwork(safeAddress) {
  // @TODO: Call core method here
  return Promise.resolve([]);
}
