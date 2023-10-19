import core from '~/services/core';
import resolveUsernames from '~/services/username';
import { addPendingActivity } from '~/store/activity/actions';
import ActionTypes from '~/store/trust/types';
import { NEEDED_TRUST_CONNECTIONS } from '~/utils/constants';
import logError from '~/utils/debug.js';

const USER_RESOLVE_CHUNK_SIZE = 50;

const { ActivityTypes } = core.activity;

export function checkTrustState() {
  return async (dispatch, getState) => {
    const { safe, trust } = getState();
    const safeAddress = safe.pendingAddress || safe.currentAccount;

    // Safe address does not exist or is not deployed yet
    if (!safeAddress) {
      return;
    }

    try {
      const network = await core.trust.getNetwork(safeAddress);

      // Check if we reached a trusted status (to be ready for final Safe
      // deployment)
      let isTrusted = trust.isTrusted;
      let trustConnections = trust.trustConnections;

      if (!trust.isTrusted) {
        const result = await core.trust.isTrusted(safeAddress, {
          limit: NEEDED_TRUST_CONNECTIONS,
        });
        isTrusted = result.isTrusted;
        trustConnections = result.trustConnections;
      }

      // Resolve usernames in batches
      const chunks = network
        .reduce((acc, item, index) => {
          const chunkIndex = Math.floor(index / USER_RESOLVE_CHUNK_SIZE);
          if (!acc[chunkIndex]) {
            acc[chunkIndex] = [];
          }
          acc[chunkIndex].push(item);
          return acc;
        }, [])
        .map((chunk) => {
          return resolveUsernames(
            chunk.map((connection) => {
              return connection.safeAddress;
            }),
          );
        });

      // Merge all results to one object after they got loaded
      const results = (await Promise.all(chunks)).reduce((acc, result) => {
        Object.keys(result).forEach((safeAddress) => {
          acc[safeAddress] = result[safeAddress];
        });
        return acc;
      }, {});

      const resolvedNetwork = network
        .map((connection) => {
          return {
            ...connection,
            ...results[connection.safeAddress],
          };
        })
        .sort((itemA, itemB) => {
          // Use safeAddress as a fallback when username does not exist
          const valueA = itemA.username ? itemA.username : itemA.safeAddress;
          const valueB = itemB.username ? itemB.username : itemB.safeAddress;
          return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
        });

      dispatch({
        type: ActionTypes.TRUST_UPDATE,
        meta: {
          isTrusted,
          network: resolvedNetwork,
          trustConnections,
        },
      });
    } catch (error) {
      logError(error);
    }
  };
}

export function trustUser(safeAddress) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (!safe.currentAccount) {
      return;
    }

    const user = safeAddress;
    const canSendTo = safe.currentAccount;
    const {
      receipt: { transactionHash },
    } = await core.trust.addConnection(user, canSendTo);

    dispatch(
      addPendingActivity({
        txHash: transactionHash,
        type: ActivityTypes.ADD_CONNECTION,
        data: {
          user,
          canSendTo,
        },
      }),
    );
  };
}

export function untrustUser(safeAddress) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (!safe.currentAccount) {
      return;
    }

    const user = safeAddress;
    const canSendTo = safe.currentAccount;
    const {
      receipt: { transactionHash },
    } = await core.trust.removeConnection(user, canSendTo);

    dispatch(
      addPendingActivity({
        txHash: transactionHash,
        type: ActivityTypes.REMOVE_CONNECTION,
        data: {
          user,
          canSendTo,
        },
      }),
    );
  };
}
