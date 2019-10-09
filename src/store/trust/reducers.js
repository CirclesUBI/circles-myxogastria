import update from 'immutability-helper';

import ActionTypes from '~/store/trust/types';

const initialState = {
  isTrusted: false,
  network: [],
};

const trustReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TRUST_UPDATE:
      return update(state, {
        isTrusted: { $set: action.meta.isTrusted },
        network: { $set: action.meta.network },
      });
    default:
      return state;
  }
};

export default trustReducer;
