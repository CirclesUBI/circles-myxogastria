import web3 from '~/services/web3';
import { formatCirclesValue } from '~/utils/format';

describe('Format utils', () => {
  describe('formatCirclesValue', () => {
    it('should print a human readable currency string', () => {
      const { toWei } = web3.utils;
      const format = formatCirclesValue;

      expect(format(toWei('100', 'ether'))).toBe('100');
      expect(format(toWei('1.12345', 'ether'))).toBe('1.12');
      expect(format(toWei('1.12345', 'ether'), 3)).toBe('1.123');
    });
  });
});
