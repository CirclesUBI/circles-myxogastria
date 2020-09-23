import { useSelector } from 'react-redux';

import core from '~/services/core';

const { ActivityTypes } = core.activity;

export function usePending(findFunction) {
  const { activities } = useSelector((state) => state.activity);
  const activity = activities.find(findFunction);
  return activity ? activity.isPending : false;
}

export function usePendingTransfer(safeAddress) {
  return usePending((activity) => {
    return (
      activity.type === ActivityTypes.HUB_TRANSFER &&
      activity.data.to === safeAddress
    );
  });
}

export function usePendingTrust(safeAddress) {
  return usePending((activity) => {
    return (
      (activity.type === ActivityTypes.ADD_CONNECTION ||
        activity.type === ActivityTypes.REMOVE_CONNECTION) &&
      activity.data.user === safeAddress
    );
  });
}
