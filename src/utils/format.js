import { crcToTc } from '@circles/timecircles';

import web3 from '~/services/web3';

export function formatCirclesValue(value, date = Date.now(), decimals = 2) {
  const valueEth = web3.utils.fromWei(value);
  // valueEth is a string
  // crcToTc accepts/converts string to number and returns a number
  const valueTc = crcToTc(date, valueEth);

  return valueTc.toFixed(decimals);
}
