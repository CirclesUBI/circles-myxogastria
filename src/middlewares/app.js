import ActionTypes from '~/store/app/types';
import { connect } from '~/services/web3';

function connectWeb3(store) {
  const onConnectionStateChange = isConnected => {
    if (isConnected) {
      store.dispatch({
        type: ActionTypes.APP_CONNECT_SUCCESS,
      });
    } else {
      store.dispatch({
        type: ActionTypes.APP_CONNECT_ERROR,
      });
    }
  };

  connect(onConnectionStateChange);
}

const appMiddleware = store => next => action => {
  if (action.type === ActionTypes.APP_CONNECT) {
    connectWeb3(store);
  }

  next(action);
};

export default appMiddleware;
