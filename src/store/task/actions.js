import ActionTypes from '~/store/task/types';

export function addTask({ txHash, type, data }) {
  return {
    type: ActionTypes.TASKS_ADD,
    meta: {
      data,
      txHash,
      type,
    },
  };
}

export function removeTask(id) {
  return {
    type: ActionTypes.TASKS_REMOVE,
    meta: {
      id,
    },
  };
}

export function removeAllTasks() {
  return {
    type: ActionTypes.TASKS_REMOVE_ALL,
  };
}
