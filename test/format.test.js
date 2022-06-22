import web3 from '~/services/web3';
import { formatCirclesValue } from '~/utils/format';

describe('Format utils', () => {
  describe('formatCirclesValue', () => {
    it('should print a human readable currency string which is the same as CRC when timestamp is circles launch date', () => {
      const { toWei } = web3.utils;
      const format = formatCirclesValue;
      const circlesInceptionTimestamp = new Date("2020-10-15T00:00:00.000Z").getTime();

      expect(format(toWei('100', 'ether'), circlesInceptionTimestamp)).toBe('300');
      expect(format(toWei('1.12345', 'ether'), circlesInceptionTimestamp)).toBe('3.36');
      expect(format(toWei('1.12345', 'ether'), circlesInceptionTimestamp, 3)).toBe('3.369');
    });
  });
});
