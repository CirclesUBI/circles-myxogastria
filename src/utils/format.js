import { crcToTc } from '@circles/timecircles';

import core from '~/services/core';

const roundDownToString = (amount, nbrOfDecimals) => {
  const [wholeNumber, decimals] = amount.toString().split('.');

  if (!decimals || decimals == '' || nbrOfDecimals == 0) {
    return wholeNumber;
  }

  return `${wholeNumber}.${decimals.slice(0, nbrOfDecimals)}`;
};

/**
 * Will convert and format Freckles to Time Circles
 * @param {string} valueInFreckles
 * @param {Date | number} timestamp date of Time Circles conversion (default present time)
 * @param {number} decimals number of decimals in returned Time Circles value (default 2)
 * @param {roundDown} bool if true returned value will never round up (default), false to use normal mathematical rounding
 * @returns formatted Time Circles value as string (rounded down at specified number of decimals)
 */
export function formatCirclesValue(
  valueInFreckles,
  timestamp = Date.now(),
  nbrOfDecimals = 2,
  roundDown = true,
) {
  const valueInCircles = core.utils.fromFreckles(valueInFreckles);
  const valueInTimeCircles = crcToTc(timestamp, Number(valueInCircles));

  return roundDown
    ? roundDownToString(valueInTimeCircles, nbrOfDecimals)
    : valueInTimeCircles.toFixed(nbrOfDecimals).toString();
}
