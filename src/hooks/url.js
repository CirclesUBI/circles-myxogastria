import { PROFILE_PATH } from '~/routes';

export function useProfileLink(address) {
  return `${process.env.BASE_PATH}${PROFILE_PATH.replace(':address', address)}`;
}
