import ActionTypes from '~/store/trust/types';
import { getTrustNetwork } from '~/services/core';

const TRUST_CONNECTION_LIMIT = 3;

export function checkTrustState() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (!safe.address) {
      return;
    }

    const network = await getTrustNetwork(safe.address);

    const isTrusted =
      network.reduce((acc, connection) => {
        return connection.isTrustingMe ? acc + 1 : acc;
      }, 0) > TRUST_CONNECTION_LIMIT;

    dispatch({
      type: ActionTypes.TRUST_UPDATE,
      meta: {
        isTrusted,
        network,
      },
    });
  };
}
