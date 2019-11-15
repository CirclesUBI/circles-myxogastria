import createTypes from 'redux-create-action-types';

export default createTypes(
  'APP_AUTHORIZE',
  'APP_UNAUTHORIZE',
  'APP_CONNECT',
  'APP_CONNECT_ERROR',
  'APP_CONNECT_SUCCESS',
  'APP_INITIALIZE',
  'APP_INITIALIZE_ERROR',
  'APP_INITIALIZE_SUCCESS',
  'APP_SPINNER_HIDE',
  'APP_SPINNER_SHOW',
);
