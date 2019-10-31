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

async function requestCore(moduleName, method, options) {
  return await core[moduleName][method](getAccount(), options);
}

// Safe module

const safe = {
  prepareDeploy: async nonce => {
    return await requestCore('safe', 'prepareDeploy', {
      nonce,
    });
  },

  deploy: async safeAddress => {
    return await requestCore('safe', 'deploy', {
      safeAddress,
    });
  },

  getOwners: async safeAddress => {
    return await requestCore('safe', 'getOwners', {
      safeAddress,
    });
  },

  removeOwner: async (safeAddress, ownerAddress) => {
    return await requestCore('safe', 'removeOwner', {
      safeAddress,
      ownerAddress,
    });
  },

  addOwner: async (safeAddress, ownerAddress) => {
    return await requestCore('safe', 'addOwner', {
      safeAddress,
      ownerAddress,
    });
  },

  // eslint-disable-next-line no-unused-vars
  getAddress: async ownerAddress => {
    return Promise.resolve();
    // @TODO: Core method is not implemented yet
    // const account = getAccount();
    // return await core.safe.getAddress(account, {
    //   ownerAddress,
    // });
  },
};

// User module

const user = {
  register: async (nonce, safeAddress, username) => {
    return await requestCore('user', 'register', {
      nonce,
      safeAddress,
      username,
    });
  },

  resolve: async addresses => {
    return await requestCore('user', 'resolve', {
      addresses,
    });
  },
};

// Trust module

const trust = {
  // eslint-disable-next-line no-unused-vars
  getNetwork: async safeAddress => {
    // @TODO: Core method is not implemented yet
    return Promise.resolve([]);
  },

  addConnection: async (from, to) => {
    return await requestCore('trust', 'addConnection', {
      from,
      to,
    });
  },

  removeConnection: async (from, to) => {
    return await requestCore('trust', 'removeConnection', {
      from,
      to,
    });
  },
};

// Token module

const token = {
  deploy: async safeAddress => {
    return await requestCore('token', 'signup', {
      safeAddress,
    });
  },

  getBalance: async (safeAddress, tokenAddress) => {
    return await requestCore('token', 'getBalance', {
      safeAddress,
      tokenAddress,
    });
  },

  getAddress: async safeAddress => {
    return await requestCore('token', 'getAddress', {
      safeAddress,
    });
  },

  transfer: async (from, to, value) => {
    return await requestCore('token', 'transfer', {
      from,
      to,
      value,
    });
  },
};

export default {
  safe,
  token,
  trust,
  user,
};
