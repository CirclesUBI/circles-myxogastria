import update from 'immutability-helper';

import ActionTypes from '~/store/task/types';

const initialState = {
  nextId: 1,
  tasks: [],
};

const initialStateTask = {
  data: {},
  id: 1,
  isError: false,
  isPending: true,
  txHash: null,
  type: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TASKS_ADD: {
      const task = Object.assign({}, initialStateTask, action.meta, {
        id: state.nextId,
      });

      return update(state, {
        tasks: { $push: [task] },
        nextId: { $set: state.nextId + 1 },
      });
    }
    case ActionTypes.TASKS_REMOVE: {
      const index = state.tasks.findIndex(item => {
        return item.id === action.meta.id;
      });

      if (index === -1) {
        return state;
      }

      return update(state, {
        tasks: { $splice: [[index, 1]] },
      });
    }
    case ActionTypes.TASKS_REMOVE_ALL:
      return update(state, {
        tasks: { $set: [] },
      });
    default:
      return state;
  }
};

export default taskReducer;
