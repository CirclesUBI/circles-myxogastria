import { useEffect, useState } from 'react';

import core from '~/services/core';

const { organization } = core;

export function useIsOrganization(safeAddress) {
  const [isOrganization, setIsOrganization] = useState(false);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    let isUnloaded = false;

    const request = async () => {
      const result = await organization.isOrganization(safeAddress);

      if (isUnloaded) {
        return;
      }

      setIsOrganization(result);
      setIsPending(false);
    };

    setIsPending(true);
    request();

    return () => {
      isUnloaded = true;
    };
  }, [safeAddress]);

  return { isOrganization, isPending };
}
