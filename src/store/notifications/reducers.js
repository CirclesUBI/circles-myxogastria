import update from 'immutability-helper';

import ActionTypes from '~/store/notifications/types';
import { NotificationsTypes } from '~/store/notifications/actions';

const initialState = {
  messages: [],
  nextId: 1,
};

const initialStateMessage = {
  id: 1,
  lifetime: 0,
  text: '',
  type: NotificationsTypes.INFO,
};

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.NOTIFICATIONS_ADD: {
      const message = Object.assign({}, initialStateMessage, action.meta, {
        id: state.nextId,
      });

      return update(state, {
        messages: { $push: [message] },
        nextId: { $set: state.nextId + 1 },
      });
    }
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
};

export default notificationsReducer;
