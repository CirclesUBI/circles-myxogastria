import ActionTypes from '~/store/trust/types';
import core from '~/services/core';
import logError from '~/utils/debug.js';
import resolveUsernames from '~/services/username';
import { addPendingActivity } from '~/store/activity/actions';

const { ActivityTypes } = core.activity;

export function checkTrustState() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    // Safe address does not exist or is not deployed yet
    if (!safe.address) {
      return;
    }

    try {
      const network = await core.trust.getNetwork(safe.address);

      // Check if we reached a trusted status (to be ready for
      // final Safe deployment)
      const isTrusted = await core.trust.isTrusted(safe.address);

      // Resolve usernames
      const usernames = await resolveUsernames(
        network.map((connection) => {
          return connection.safeAddress;
        }),
      );

      const resolvedNetwork = network
        .map((connection) => {
          return {
            ...connection,
            username:
              usernames[connection.safeAddress] || connection.safeAddress,
          };
        })
        .sort((itemA, itemB) => {
          return itemA.username
            .toLowerCase()
            .localeCompare(itemB.username.toLowerCase());
        });

      dispatch({
        type: ActionTypes.TRUST_UPDATE,
        meta: {
          isTrusted,
          network: resolvedNetwork,
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

    if (!safe.address) {
      return;
    }

    const user = safeAddress;
    const canSendTo = safe.address;

    const txHash = await core.trust.addConnection(user, canSendTo);

    dispatch(
      addPendingActivity({
        txHash,
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

    if (!safe.address) {
      return;
    }

    const user = safeAddress;
    const canSendTo = safe.address;

    const txHash = await core.trust.removeConnection(user, canSendTo);

    dispatch(
      addPendingActivity({
        txHash,
        type: ActivityTypes.REMOVE_CONNECTION,
        data: {
          user,
          canSendTo,
        },
      }),
    );
  };
}
