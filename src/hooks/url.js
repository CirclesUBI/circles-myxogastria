import qs from 'qs';
import { generatePath, useLocation } from 'react-router';

import { PROFILE_PATH, SEND_CONFIRM_PATH, SEND_PATH } from '~/routes';

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

export function useSendLink(address, amount, paymentNote) {
  const query = qs.stringify({
    a: amount,
    n: paymentNote,
  });

  const relative = useRelativeSendLink(address);
  return `${process.env.BASE_PATH}${relative}?${query}`;
}

export function useQuery() {
  const location = useLocation();
  return qs.parse(location.search.slice(1));
}
