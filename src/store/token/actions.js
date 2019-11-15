import ActionTypes from '~/store/token/types';
import web3 from '~/services/web3';
import { ZERO_ADDRESS } from '~/utils/constants';
import core from '~/services/core';

export function deployToken() {
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
      const address = await core.token.deploy(safe.address);

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

    // Safe address is not known or deployed yet
    if (!safe.address || safe.nonce) {
      // ... reset Token when it was set before
      if (token.address) {
        dispatch({
          type: ActionTypes.TOKEN_RESET,
        });
      }

      return;
    }

    // Token address already exists
    if (token.address) {
      return;
    }

    dispatch({
      type: ActionTypes.TOKEN_UPDATE,
    });

    try {
      const address = await core.token.getAddress(safe.address);

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
      const balance = await core.token.getBalance(safe.address);

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

export function transferCircles(to, value) {
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

      await core.token.transfer(from, to, valueInWei);

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
