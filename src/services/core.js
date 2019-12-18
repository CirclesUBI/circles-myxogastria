import CirclesCore from '@circles/core';

import web3 from '~/services/web3';
import { getAccount } from '~/services/wallet';

const core = new CirclesCore(web3, {
  safeMasterAddress: process.env.SAFE_ADDRESS,
  hubAddress: process.env.HUB_ADDRESS,
  proxyFactoryAddress: process.env.PROXY_FACTORY_ADDRESS,
  usernameServiceEndpoint: process.env.USERNAME_SERVICE_EXTERNAL,
  relayServiceEndpoint: process.env.RELAY_SERVICE_EXTERNAL,
  graphNodeEndpoint: process.env.GRAPH_NODE_EXTERNAL,
  subgraphName: process.env.SUBGRAPH_NAME,
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

  getAddress: async ownerAddress => {
    return await requestCore('safe', 'getAddress', {
      ownerAddress,
    });
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
  getNetwork: async safeAddress => {
    return await requestCore('trust', 'getNetwork', {
      safeAddress,
    });
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
    return await requestCore('token', 'deploy', {
      safeAddress,
    });
  },

  getBalance: async safeAddress => {
    return await requestCore('token', 'getBalance', {
      safeAddress,
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

// Activity module

const activity = {
  ActivityTypes: core.activity.ActivityTypes,

  getLatest: async (safeAddress, timestamp) => {
    return await requestCore('activity', 'getLatest', {
      safeAddress,
      timestamp,
    });
  },
};

// Utils module

const { fromFreckles, toFreckles } = core.utils;

const utils = {
  fromFreckles,
  toFreckles,
};

// Errors

const { CoreError, TransferError, RequestError } = core;

const errors = {
  CoreError,
  TransferError,
  RequestError,
};

export default {
  activity,
  errors,
  safe,
  token,
  trust,
  user,
  utils,
};
