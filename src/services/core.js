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
    safeAddress,
  });
}

export async function getOwners(safeAddress) {
  const account = getAccount();

  return await core.safe.getOwners(account, {
    safeAddress,
  });
}

export async function removeOwner(safeAddress, ownerAddress) {
  const account = getAccount();

  return await core.safe.removeOwner(account, {
    safeAddress,
    ownerAddress,
  });
}

export async function addOwner(safeAddress, ownerAddress) {
  const account = getAccount();

  return await core.safe.addOwner(account, {
    safeAddress,
    ownerAddress,
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

export async function addTrustConnection(from, to) {
  const account = getAccount();

  return core.trust.addConnection(account, {
    from,
    to,
  });
}

export async function removeTrustConnection(from, to) {
  const account = getAccount();

  return core.trust.removeConnection(account, {
    from,
    to,
  });
}

// UBI module

export async function signup(safeAddress) {
  const account = getAccount();

  return await core.token.signup(account, {
    safeAddress,
  });
}

export async function getBalance(safeAddress, tokenAddress) {
  const account = getAccount();

  return await core.token.getBalance(account, {
    safeAddress,
    tokenAddress,
  });
}

export async function getTokenAddress(safeAddress) {
  const account = getAccount();

  return await core.token.getAddress(account, {
    safeAddress,
  });
}

export async function transfer(from, to, value) {
  const account = getAccount();

  return await core.token.transfer(account, {
    from,
    to,
    value,
  });
}
