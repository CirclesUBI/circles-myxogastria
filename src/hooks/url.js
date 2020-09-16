import { generatePath } from 'react-router';

import { PROFILE_PATH } from '~/routes';

export function useProfileLink(address) {
  return `${process.env.BASE_PATH}${generatePath(PROFILE_PATH, {
    address,
  })}`;
}
