import qs from 'qs';
import { generatePath, useLocation } from 'react-router';

import { SEND_CONFIRM_PATH, SEND_PATH, PROFILE_PATH } from '~/routes';

export function useRelativeProfileLink(address) {
  return generatePath(PROFILE_PATH, {
    address,
  });
}

export function useProfileLink(address) {
  const relative = useRelativeProfileLink(address);
  return `${process.env.BASE_PATH}${relative}`;
}

export function useRelativeSendLink(address) {
  if (!address) {
    return generatePath(SEND_PATH);
  }

  return generatePath(SEND_CONFIRM_PATH, {
    address,
  });
}

export function useSendLink(address) {
  const relative = useRelativeSendLink(address);
  return `${process.env.BASE_PATH}${relative}`;
}

export function useQuery() {
  const location = useLocation();
  return qs.parse(location.search.slice(1));
}
