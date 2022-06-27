import { crcToTc } from '@circles/timecircles';

import web3 from '~/services/web3';

const roundDownToString = (amount, nbrOfDecimals) => {
  const [wholeNumber, decimals] = amount.toString().split('.');

  if (!decimals) {
    return wholeNumber;
  }

  return `${wholeNumber}.${decimals.slice(0, nbrOfDecimals)}`;
};

/**
 * Will convert and format Freckles to Time Circles
 * @param {string} valueInFreckles
 * @param {Date | number} timestamp date of Time Circles conversion (default present time)
 * @param {number} decimals number of decimals in returned Time Circles value (default 2)
 * @returns formatted Time Circles value as string (rounded down at specified number of decimals)
 */
export function formatCirclesValue(
  valueInFreckles,
  timestamp = Date.now(),
  nbrOfDecimals = 2,
  roundDown = true,
) {
  const valueInCircles = web3.utils.fromWei(valueInFreckles);
  const valueInTimeCircles = crcToTc(timestamp, Number(valueInCircles));

  return roundDown
    ? roundDownToString(valueInTimeCircles, nbrOfDecimals)
    : valueInTimeCircles.toFixed().toString();
}
