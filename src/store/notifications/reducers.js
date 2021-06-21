import update from 'immutability-helper';

import { NotificationsTypes } from '~/store/notifications/actions';
import ActionTypes from '~/store/notifications/types';

const initialState = {
  messages: [],
  nextId: 1,
};

const initialStateMessage = {
  id: 1,
  lifetime: 0,
  text: '',
  type: NotificationsTypes.INFO,
  isDismissed: false,
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
      const index = state.messages.findIndex((item) => {
        return item.id === action.meta.id;
      });

      if (index === -1) {
        return state;
      }

      return update(state, {
        messages: { $splice: [[index, 1]] },
      });
    }
    case ActionTypes.NOTIFICATIONS_DISMISS: {
      return update(state, {
        messages: {
          $set: state.messages.map((message) => {
            if (message.id === action.meta.id) {
              return {
                ...message,
                isDismissed: true,
              };
            }

            return message;
          }),
        },
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
