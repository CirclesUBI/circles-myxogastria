import { useEffect, useState } from 'react';

import core from '~/services/core';
import resolveUsernames from '~/services/username';

function defaultUserdata(address) {
  return {
    id: null,
    avatarUrl: null,
    safeAddress: address,
    username: address ? address.slice(0, 10) : '',
  };
}

export function useIsOrganization(address) {
  const [isOrganization, setIsOrganization] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isUnloaded = false;

    const request = async () => {
      const result = await core.organization.isOrganization(address);

      if (isUnloaded) {
        return;
      }

      setIsOrganization(result);
      setIsReady(true);
    };

    if (!address) {
      setIsOrganization(false);
      setIsReady(true);
    } else {
      setIsReady(false);
      request();
    }

    return () => {
      isUnloaded = true;
    };
  }, [address]);

  return {
    isOrganization,
    isReady,
  };
}

export function useUserdata(address) {
  const [data, setData] = useState(defaultUserdata(address));

  useEffect(() => {
    let isUnloaded = false;

    const request = async () => {
      const result = await resolveUsernames([address]);

      if (isUnloaded) {
        return;
      }

      if (address in result) {
        setData(result[address]);
      }
    };

    if (!address) {
      setData(defaultUserdata(address));
    } else {
      request();
    }

    return () => {
      isUnloaded = true;
    };
  }, [address]);

  return data;
}
