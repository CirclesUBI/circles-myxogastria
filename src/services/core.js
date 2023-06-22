import CirclesCore from '@circles/core';

import { getAccount } from '~/services/wallet';
import web3 from '~/services/web3';
import { PATHFINDER_HOPS_DEFAULT } from '~/utils/constants';

const core = new CirclesCore(web3, {
  apiServiceEndpoint: process.env.API_SERVICE_EXTERNAL,
  fallbackHandlerAddress: process.env.SAFE_DEFAULT_CALLBACK_HANDLER,
  graphNodeEndpoint: process.env.GRAPH_NODE_EXTERNAL,
  hubAddress: process.env.HUB_ADDRESS,
  pathfinderServiceEndpoint: process.env.PATHFINDER_SERVICE_ENDPOINT,
  pathfinderType: process.env.PATHFINDER_TYPE,
  proxyFactoryAddress: process.env.PROXY_FACTORY_ADDRESS,
  relayServiceEndpoint: process.env.RELAY_SERVICE_EXTERNAL,
  safeMasterAddress: process.env.SAFE_ADDRESS,
  subgraphName: process.env.SUBGRAPH_NAME,
});

async function requestCore(moduleName, method, options) {
  return await core[moduleName][method](getAccount(), options);
}

// Safe module

const safe = {
  getSafeStatus: async (safeAddress) => {
    return await requestCore('safe', 'getSafeStatus', {
      safeAddress,
    });
  },

  predictAddress: async (nonce) => {
    return await requestCore('safe', 'predictAddress', {
      nonce,
    });
  },

  prepareDeploy: async (nonce) => {
    return await requestCore('safe', 'prepareDeploy', {
      nonce,
    });
  },

  isFunded: async (safeAddress) => {
    return await requestCore('safe', 'isFunded', {
      safeAddress,
    });
  },

  deploy: async (safeAddress) => {
    return await requestCore('safe', 'deploy', {
      safeAddress,
    });
  },

  deployForOrganization: async (safeAddress) => {
    return await requestCore('safe', 'deployForOrganization', {
      safeAddress,
    });
  },

  getOwners: async (safeAddress) => {
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

  getAddresses: async (ownerAddress) => {
    return await requestCore('safe', 'getAddresses', {
      ownerAddress,
    });
  },

  getVersion: async (safeAddress) => {
    return await requestCore('safe', 'getVersion', {
      safeAddress,
    });
  },

  updateToLastVersion: async (safeAddress) => {
    return await requestCore('safe', 'updateToLastVersion', {
      safeAddress,
    });
  },
};

// User module

const user = {
  register: async (nonce, safeAddress, username, email, avatarUrl) => {
    return await requestCore('user', 'register', {
      nonce,
      email,
      safeAddress,
      username,
      avatarUrl,
    });
  },

  resolve: async (addresses) => {
    return await requestCore('user', 'resolve', {
      addresses,
    });
  },

  search: async (query) => {
    return await requestCore('user', 'search', {
      query,
    });
  },

  update: async (safeAddress, username, email, avatarUrl) => {
    return await requestCore('user', 'update', {
      safeAddress,
      username,
      email,
      avatarUrl,
    });
  },

  getEmail: async (safeAddress) => {
    return await requestCore('user', 'getEmail', {
      safeAddress,
    });
  },
};

// Trust module

const trust = {
  isTrusted: async (safeAddress) => {
    return await requestCore('trust', 'isTrusted', {
      safeAddress,
    });
  },

  getNetwork: async (safeAddress) => {
    return await requestCore('trust', 'getNetwork', {
      safeAddress,
    });
  },

  addConnection: async (user, canSendTo) => {
    return await requestCore('trust', 'addConnection', {
      user,
      canSendTo,
    });
  },

  removeConnection: async (user, canSendTo) => {
    return await requestCore('trust', 'removeConnection', {
      user,
      canSendTo,
    });
  },
};

// Token module

const token = {
  checkSendLimit: async (from, to) => {
    return await requestCore('token', 'checkSendLimit', {
      from,
      to,
    });
  },

  isFunded: async (safeAddress) => {
    return await requestCore('token', 'isFunded', {
      safeAddress,
    });
  },

  deploy: async (safeAddress) => {
    return await requestCore('token', 'deploy', {
      safeAddress,
    });
  },

  getBalance: async (safeAddress) => {
    return await requestCore('token', 'getBalance', {
      safeAddress,
    });
  },

  getAddress: async (safeAddress) => {
    return await requestCore('token', 'getAddress', {
      safeAddress,
    });
  },

  getPaymentNote: async (transactionHash) => {
    return await requestCore('token', 'getPaymentNote', {
      transactionHash,
    });
  },

  findTransitiveTransfer: async (
    from,
    to,
    value,
    hops = PATHFINDER_HOPS_DEFAULT,
  ) => {
    return await requestCore('token', 'findTransitiveTransfer', {
      from,
      to,
      value,
      hops,
    });
  },

  transfer: async (
    from,
    to,
    value,
    paymentNote,
    hops = PATHFINDER_HOPS_DEFAULT,
  ) => {
    return await requestCore('token', 'transfer', {
      from,
      to,
      value,
      paymentNote,
      hops,
    });
  },

  updateTransferSteps: async (
    from,
    to,
    value,
    hops = PATHFINDER_HOPS_DEFAULT,
  ) => {
    return await requestCore('token', 'updateTransferSteps', {
      from,
      to,
      value,
      hops,
    });
  },

  checkUBIPayout: async (safeAddress) => {
    return await requestCore('token', 'checkUBIPayout', {
      safeAddress,
    });
  },

  requestUBIPayout: async (safeAddress) => {
    return await requestCore('token', 'requestUBIPayout', {
      safeAddress,
    });
  },

  listAllTokens: async (safeAddress) => {
    return await requestCore('token', 'listAllTokens', {
      safeAddress,
    });
  },
};

// Activity module

const activity = {
  ActivityTypes: core.activity.ActivityTypes,
  ActivityFilterTypes: core.activity.ActivityFilterTypes,

  getLatest: async (
    safeAddress,
    filter,
    limit,
    timestamp = 0,
    offset = 0,
    otherSafeAddress,
  ) => {
    return await requestCore('activity', 'getLatest', {
      filter,
      limit,
      offset,
      safeAddress,
      timestamp,
      otherSafeAddress,
    });
  },
};

// News module
const news = {
  activities: [
    {
      createdAt: '2023-02-05T22:14:01.714+04:00',
      id: '1',
      isPending: false,
      title: 'We have some problems! In two lines, in two lines ',
      text: '<p>Lorem ipsum text...</p><p>Lorem ipsum text </p>',
      url: 'https://market.joincircles.net/',
      date: '15.05.2022',
      icon: 'IconHeartWithExclamationMark',
    },
    {
      createdAt: '2023-02-05T22:12:03.214+04:00',
      id: '2',
      isPending: false,
      title: 'Welcome to Circles!',
      text: '<p>Lorem ipsum text...</p><p>Lorem ipsum text </p>',
      url: 'https://market.joincircles.net/',
      date: '15.05.2022',
      icon: 'IconCirclesLogoLight',
    },
    {
      createdAt: '2023-02-05T22:12:01.000+04:00',
      id: '3',
      isPending: false,
      title: 'New Features!',
      text: '<p>Lorem ipsum text...</p><p>Lorem ipsum text </p>',
      url: 'https://market.joincircles.net/',
      date: '15.05.2022',
      icon: 'IconExclamationAndQuestionMark',
    },
    {
      createdAt: '2023-02-04T12:24:46.000+04:00',
      id: '4',
      isPending: false,
      title: 'We have some problems! In two lines, in two lines ',
      text: '<p>Lorem ipsum text...</p><p>Lorem ipsum text </p>',
      url: 'https://market.joincircles.net/',
      date: '15.05.2022',
      icon: 'IconExclamationAndQuestionMark',
    },
    {
      createdAt: '2023-02-04T12:21:31.000+04:00',
      id: '5',
      isPending: false,
      title: '2We have some problems! In two lines, in two lines ',
      text: '<p>Lorem ipsum text...</p><p>Lorem ipsum text </p>',
      url: 'https://market.joincircles.net/',
      date: '15.05.2022',
      icon: 'IconHeartWithExclamationMark',
    },
    {
      createdAt: '2023-02-03T15:27:33.000+04:00',
      id: '6',
      isPending: false,
      title: '2Welcome to Circles!',
      text: '<p>Lorem ipsum text...</p><p>Lorem ipsum text </p>',
      url: 'https://market.joincircles.net/',
      date: '15.05.2022',
      icon: 'IconCirclesLogoLight',
    },
    {
      createdAt: '2023-02-03T15:25:38.000+04:00',
      id: '7',
      isPending: false,
      title: '2New Features!',
      text: '<p>Lorem ipsum text...</p><p>Lorem ipsum text </p>',
      url: 'https://market.joincircles.net/',
      date: '15.05.2022',
      icon: 'IconExclamationAndQuestionMark',
    },
    {
      createdAt: '2023-02-03T15:02:27.000+04:00',
      id: '8',
      isPending: false,
      title: '2We have some problems! In two lines',
      text: '<p>Lorem ipsum text...</p><p>Lorem ipsum text </p>',
      url: 'https://market.joincircles.net/',
      date: '15.05.2022',
      icon: 'IconExclamationAndQuestionMark',
    },
  ],
};
// Organization module

const organization = {
  isFunded: async (safeAddress) => {
    return await requestCore('organization', 'isFunded', {
      safeAddress,
    });
  },

  isOrganization: async (safeAddress) => {
    return await requestCore('organization', 'isOrganization', {
      safeAddress,
    });
  },

  deploy: async (safeAddress) => {
    return await requestCore('organization', 'deploy', {
      safeAddress,
    });
  },

  prefund: async (from, to, value) => {
    return await requestCore('organization', 'prefund', {
      from,
      to,
      value,
    });
  },

  getMembers: async (safeAddress) => {
    return await requestCore('organization', 'getMembers', {
      safeAddress,
    });
  },
};

// Utils module

const { fromFreckles, toFreckles, requestAPI, matchAddress } = core.utils;

const utils = {
  fromFreckles,
  matchAddress,
  requestAPI,
  toFreckles,
};

// Errors

const { ErrorCodes, CoreError, TransferError, RequestError } = core;

const errors = {
  ErrorCodes,
  CoreError,
  RequestError,
  TransferError,
};

export default {
  activity,
  errors,
  news,
  organization,
  safe,
  token,
  trust,
  user,
  utils,
};
