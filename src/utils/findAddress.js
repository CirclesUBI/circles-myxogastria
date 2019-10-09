import web3 from '~/services/web3';

const regex = new RegExp('0[xX][0-9a-f]{40}', 'i');

export default function findAddress(str) {
  if (!str) {
    throw new Error('Empty string given');
  }

  if (web3.utils.isAddress(str)) {
    return str;
  }

  const result = str.match(regex);

  if (!result || !web3.utils.isAddress(result[0])) {
    throw new Error('Could not find any valid address');
  }

  return result[0];
}
