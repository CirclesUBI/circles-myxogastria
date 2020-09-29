import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { usePendingTrust } from '~/hooks/activity';

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
      isMeTrusting,
      isPending,
      isTrustingMe,
    };
  }, [isPending, network, address]);
}
