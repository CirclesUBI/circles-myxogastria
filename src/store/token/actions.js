import ActionTypes from '~/store/token/types';
import web3 from '~/services/web3';
import { ZERO_ADDRESS } from '~/utils/constants';
import { getBalance, transfer, getTokenAddress, signup } from '~/services/core';

export function deployNewToken() {
  return async (dispatch, getState) => {
    const { safe, token } = getState();

    // Token address already exists
    if (token.address) {
      return;
    }

    // Safe is not deployed yet
    if (safe.nonce) {
      return;
    }

    dispatch({
      type: ActionTypes.TOKEN_DEPLOY,
    });

    try {
      const address = await signup(safe.address);

      dispatch({
        type: ActionTypes.TOKEN_DEPLOY_SUCCESS,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_DEPLOY_ERROR,
      });

      throw error;
    }
  };
}

export function checkTokenState() {
  return async (dispatch, getState) => {
    const { safe, token } = getState();

    // Safe address is not known yet
    if (!safe.address) {
      return;
    }

    // Token address already exists
    if (token.address) {
      return;
    }

    // Safe is not deployed yet
    if (safe.nonce) {
      return;
    }

    dispatch({
      type: ActionTypes.TOKEN_UPDATE,
    });

    try {
      const address = await getTokenAddress(safe.address);

      if (address === ZERO_ADDRESS) {
        throw new Error('Invalid Token address');
      }

      dispatch({
        type: ActionTypes.TOKEN_UPDATE_SUCCESS,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_UPDATE_ERROR,
      });

      throw error;
    }
  };
}

export function checkCurrentBalance() {
  return async (dispatch, getState) => {
    const { safe, token } = getState();

    // No token address given yet
    if (!token.address) {
      return;
    }

    dispatch({
      type: ActionTypes.TOKEN_BALANCE_UPDATE,
    });

    try {
      const balance = await getBalance(safe.address, token.address);

      dispatch({
        type: ActionTypes.TOKEN_BALANCE_UPDATE_SUCCESS,
        meta: {
          balance,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_BALANCE_UPDATE_ERROR,
      });

      throw error;
    }
  };
}

export function sendCircles(to, value) {
  return async (dispatch, getState) => {
    dispatch({
      type: ActionTypes.TOKEN_TRANSFER,
    });

    const { safe } = getState();
    const from = safe.address;

    try {
      const valueInWei = new web3.utils.BN(
        web3.utils.toWei(`${value}`, 'ether'),
      );

      await transfer(from, to, valueInWei);

      dispatch({
        type: ActionTypes.TOKEN_TRANSFER_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_TRANSFER_ERROR,
      });

      throw error;
    }
  };
}
