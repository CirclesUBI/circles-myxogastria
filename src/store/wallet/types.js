import createTypes from 'redux-create-action-types';

export default createTypes(
  'WALLET_BURN',
  'WALLET_INITIALIZE',
  'WALLET_INITIALIZE_ERROR',
  'WALLET_INITIALIZE_SUCCESS',
  'WALLET_UNLOCK',
  'WALLET_UNLOCK_ERROR',
  'WALLET_UNLOCK_FINALIZE',
  'WALLET_UNLOCK_SUCCESS',
);
