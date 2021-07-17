import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { usePendingTrust } from '~/hooks/activity';
import core from '~/services/core';
import { ZERO_ADDRESS } from '~/utils/constants';

export function useTrustConnection(address) {
  const { network } = useSelector((state) => state.trust);
  const isPending = usePendingTrust(address);

  return useMemo(() => {
    const connection = network.find(({ safeAddress }) => {
      return safeAddress === address;
    });

    const isMeTrusting = connection && connection.isIncoming;
    const isTrustingMe = connection && connection.isOutgoing;

    return {
      isPending,
      isReady: !!connection,
      isMeTrusting,
      isTrustingMe,
      mutualConnections: connection ? connection.mutualConnections : [],
    };
  }, [isPending, network, address]);
}

// Check if Safe has an deployed Token
export function useDeploymentStatus(address) {
  const [isDeployed, setIsDeployed] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isUnloaded = false;

    // Find out if Token is deployed
    const checkTokenDeployment = async () => {
      try {
        const tokenAddress = await core.token.getAddress(address);

        if (isUnloaded) {
          return;
        }

        setIsDeployed(tokenAddress !== ZERO_ADDRESS);
        setIsReady(true);
      } catch {
        setIsDeployed(false);
        setIsReady(true);
      }
    };

    checkTokenDeployment();

    return () => {
      isUnloaded = true;
    };
  }, [address]);

  return {
    isDeployed,
    isReady,
  };
}
