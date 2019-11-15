import ActionTypes from '~/store/task/types';
import web3 from '~/services/web3';

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

export function checkTasksState() {
  return async (dispatch, getState) => {
    const state = getState();
    const { tasks } = state.task;

    for (let task of tasks) {
      const receipt = await web3.eth.getTransactionReceipt(task.txHash);

      const isPending = receipt === null;
      const isError = !isPending && !receipt.status;
      const { id } = task;

      if (task.isPending !== isPending || task.isError !== isError) {
        dispatch({
          type: ActionTypes.TASKS_UPDATE,
          meta: {
            id,
            isError,
            isPending,
          },
        });
      }
    }
  };
}
