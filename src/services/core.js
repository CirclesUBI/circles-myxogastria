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

// Safe module

export async function prepareSafeDeploy(nonce) {
  const account = getAccount();

  return await core.safe.prepareDeploy(account, {
    nonce,
  });
}

export async function deploySafe(safeAddress) {
  const account = getAccount();

  return await core.safe.deploy(account, {
    address: safeAddress,
  });
}

export async function getOwners(safeAddress) {
  const account = getAccount();

  return await core.safe.getOwners(account, {
    address: safeAddress,
  });
}

export async function removeOwner(safeAddress, ownerAddress) {
  const account = getAccount();

  return await core.safe.removeOwner(account, {
    address: safeAddress,
    owner: ownerAddress,
  });
}

export async function addOwner(safeAddress, ownerAddress) {
  const account = getAccount();

  return await core.safe.addOwner(account, {
    address: safeAddress,
    owner: ownerAddress,
  });
}

// eslint-disable-next-line no-unused-vars
export async function findSafeAddress(ownerAddress) {
  return Promise.resolve();
  // @TODO: Core method is not implemented yet
  // const account = getAccount();
  // return await core.safe.getSafeAddress(account, {
  //   address: ownerAddress,
  // });
}

// User module

export async function registerUser(nonce, safeAddress, username) {
  const account = getAccount();

  return await core.user.register(account, {
    nonce,
    safeAddress,
    username,
  });
}

export async function resolveUsernameAddresses(addresses) {
  const account = getAccount();

  return await core.user.resolve(account, {
    addresses,
  });
}

// Trust module

// eslint-disable-next-line no-unused-vars
export async function getTrustNetwork(safeAddress) {
  // @TODO: Core method is not implemented yet
  return Promise.resolve([]);
}

// UBI module

export async function signup(safeAddress) {
  const account = getAccount();

  return await core.ubi.signup(account, {
    safeAddress,
  });
}

export async function getBalance(safeAddress, tokenAddress) {
  const account = getAccount();

  return await core.ubi.getBalance(account, {
    address: safeAddress,
    tokenAddress,
  });
}

export async function getTokenAddress(safeAddress) {
  const account = getAccount();

  return await core.ubi.getTokenAddress(account, {
    safeAddress,
  });
}
