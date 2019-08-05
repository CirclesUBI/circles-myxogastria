import update from 'immutability-helper';

import ActionTypes from '~/store/notifications/types';

const initialState = {
  messages: [],
};

export default function flash(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.NOTIFICATIONS_ADD:
      return update(state, {
        messages: { $push: [action.meta] },
      });
    case ActionTypes.NOTIFICATIONS_REMOVE: {
      const index = state.messages.findIndex(item => {
        return item.id === action.meta.id;
      });

      if (index === -1) {
        return state;
      }

      return update(state, {
        messages: { $splice: [[index, 1]] },
      });
    }
    case ActionTypes.NOTIFICATIONS_REMOVE_ALL:
      return update(state, {
        messages: { $set: [] },
      });
    default:
      return state;
  }
}
