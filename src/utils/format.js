import { crcToTc } from '@circles/timecircles';

import web3 from '~/services/web3';

export function formatCirclesValue(
  valueInFreckles,
  timestamp = Date.now(),
  decimals = 2,
) {
  const valueInCircles = web3.utils.fromWei(valueInFreckles);
  const valueInTimeCircles = crcToTc(timestamp, valueInCircles);

  return valueInTimeCircles.toFixed(decimals);
}
