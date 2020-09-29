import { useSelector } from 'react-redux';

import core from '~/services/core';

const { ActivityTypes, ActivityFilterTypes } = core.activity;

export function usePending(category, findFunction) {
  const { activities } = useSelector(
    (state) => state.activity.categories[category],
  );
  const activity = activities.find(findFunction);
  return activity ? activity.isPending : false;
}

export function usePendingTransfer(safeAddress) {
  return usePending(ActivityFilterTypes.TRANSFERS, (activity) => {
    return (
      activity.type === ActivityTypes.HUB_TRANSFER &&
      activity.data.to === safeAddress
    );
  });
}

export function usePendingTrust(safeAddress) {
  return usePending(ActivityFilterTypes.CONNECTIONS, (activity) => {
    return (
      (activity.type === ActivityTypes.ADD_CONNECTION ||
        activity.type === ActivityTypes.REMOVE_CONNECTION) &&
      activity.data.user === safeAddress
    );
  });
}
