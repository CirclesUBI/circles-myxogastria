import web3 from '~/services/web3';

export function formatCirclesValue(value, decimals = 2) {
  const valueEth = web3.utils.fromWei(value);
  const splitted = valueEth.split('.');

  if (splitted.length === 1) {
    return splitted[0];
  }

  return `${splitted[0]}.${splitted[1].slice(0, decimals)}`;
}
