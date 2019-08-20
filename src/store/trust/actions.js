import ActionTypes from '~/store/trust/types';
import { ensureSafeAddress } from '~/utils/state';
import { getTrustState } from '~/services/core';

export function checkTrustState() {
  return async (dispatch, getState) => {
    const { safe } = getState();
    const safeAddress = ensureSafeAddress(safe);

    if (!safeAddress) {
      return;
    }

    const { network, isTrusted } = await getTrustState(safeAddress);

    dispatch({
      type: ActionTypes.TRUST_UPDATE,
      meta: {
        isTrusted,
        network,
      },
    });
  };
}
