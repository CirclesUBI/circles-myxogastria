import { useEffect, useState } from 'react';

import resolveUsernames from '~/services/username';

export function useUserdata(address) {
  const [data, setData] = useState({
    id: null,
    avatarUrl: null,
    safeAddress: address,
    username: address.slice(0, 10),
  });

  useEffect(() => {
    resolveUsernames([address]).then((result) => {
      if (address in result) {
        setData(result[address]);
      }
    });
  }, [address]);

  return data;
}
