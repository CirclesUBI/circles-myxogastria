import web3 from '~/services/web3';
import { formatCirclesValue } from '~/utils/format';

describe('Format utils', () => {
  describe('formatCirclesValue', () => {
    it('should print a human readable TC currency string which is the same as CRC value when timestamp is Circles launch date', () => {
      const { toWei } = web3.utils;
      const format = formatCirclesValue;
      const circlesInceptionTimestamp = new Date("2020-10-15T00:00:00.000Z").getTime();

      expect(format(toWei('100', 'ether'), circlesInceptionTimestamp)).toBe('300.00');
      expect(format(toWei('1.12345', 'ether'), circlesInceptionTimestamp)).toBe('3.37');
      expect(format(toWei('1.12345', 'ether'), circlesInceptionTimestamp, 3)).toBe('3.370');
    });

    it('should return a lower time circles value for a timestamp later than the Circles launch date', () => {
      const { toWei } = web3.utils;
      const format = formatCirclesValue;
      const laterThanLaunchState = new Date("2021-11-15T00:00:00.000Z").getTime();

      expect(Number(format(toWei('100', 'ether'), laterThanLaunchState))).toBeLessThan(300.00);
    });
  });
});
