import { crcToTc } from '@circles/timecircles';

import web3 from '~/services/web3';

/**
 * Will convert and format Freckles to Time Circles
 * @param {string} valueInFreckles
 * @param {Date | number} timestamp date of Time Circles conversion (default present time)
 * @param {number} decimals number of decimals in returned Time Circles value (default 2)
 * @returns formatted Time Circles value
 */
export function formatCirclesValue(
  valueInFreckles,
  timestamp = Date.now(),
  decimals = 2,
) {
  const valueInCircles = web3.utils.fromWei(valueInFreckles);
  const valueInTimeCircles = crcToTc(timestamp, Number(valueInCircles));

  return valueInTimeCircles.toFixed(decimals);
}
