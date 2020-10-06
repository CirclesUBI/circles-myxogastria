import { useEffect, useState } from 'react';

import resolveTxHash from '~/services/transfer';

export function usePaymentNote(transactionHash) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isUnloaded = false;

    const request = async () => {
      isUnloaded = false;

      const result = await resolveTxHash(transactionHash);

      if (isUnloaded) {
        return;
      }

      setData(result);
    };

    if (!transactionHash) {
      setData(null);
    } else {
      request();
    }

    return () => {
      isUnloaded = true;
    };
  }, [transactionHash]);

  return data;
}
