import { useEffect, useState } from 'react';

import resolveUsernames from '~/services/username';

function defaultUserdata(address) {
  return {
    id: null,
    avatarUrl: null,
    safeAddress: address,
    username: address ? address.slice(0, 10) : '',
  };
}

export function useUserdata(address) {
  const [data, setData] = useState(defaultUserdata(address));

  useEffect(() => {
    if (!address) {
      setData(defaultUserdata(address));
    }

    resolveUsernames([address]).then((result) => {
      if (address in result) {
        setData(result[address]);
      }
    });
  }, [address]);

  return data;
}
