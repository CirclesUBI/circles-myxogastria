import web3 from '~/services/web3';
import { formatCirclesValue } from '~/utils/format';

describe('Format utils', () => {
  describe('formatCirclesValue', () => {
    it('should print a human readable TC currency string which is the same as CRC value when timestamp is Circles launch date', () => {
      const { toWei } = web3.utils;
      const format = formatCirclesValue;
      const circlesInceptionTimestamp = new Date("2020-10-15T00:00:00.000Z").getTime();

      expect(format(toWei('1.12345', 'ether'), circlesInceptionTimestamp)).toBe('3.37');
      expect(format(toWei('1.12345', 'ether'), circlesInceptionTimestamp, 3)).toBe('3.370');
    });
    
    it('should return a lower time circles value for a timestamp later than the Circles launch date', () => {
      const { toWei } = web3.utils;
      const format = formatCirclesValue;
      const laterThanLaunchState = new Date("2021-11-15T00:00:00.000Z").getTime();
      
      expect(Number(format(toWei('100', 'ether'), laterThanLaunchState))).toBeLessThan(300.00);
    });
    
    it('should round down by cutting of number by default', () => {
      const { toWei } = web3.utils;
      const format = formatCirclesValue;
      const circlesInceptionTimestamp = new Date("2020-10-15T00:00:00.000Z").getTime();
      
      expect(format(toWei('1.32345', 'ether'), circlesInceptionTimestamp, 0)).toBe('3');
      expect(format(toWei('1.32345', 'ether'), circlesInceptionTimestamp, 1)).toBe('3.9');
      expect(format(toWei('1.32345', 'ether'), circlesInceptionTimestamp, 2)).toBe('3.97');
      expect(format(toWei('1.32345', 'ether'), circlesInceptionTimestamp, 4)).toBe('3.9703');
    });
    
    it('should round correctly when using roundDown false', () => {
      const { toWei } = web3.utils;
      const format = formatCirclesValue;
      const circlesInceptionTimestamp = new Date("2020-10-15T00:00:00.000Z").getTime();
      const roundDown = false;
      
      // reference time circles translation with 8 decimals 3.97366800
      expect(format(toWei('1.32456', 'ether'), circlesInceptionTimestamp, 0, roundDown)).toBe('4');
      expect(format(toWei('1.32456', 'ether'), circlesInceptionTimestamp, 1, roundDown)).toBe('4.0');
      expect(format(toWei('1.32456', 'ether'), circlesInceptionTimestamp, 2, roundDown)).toBe('3.97');
      expect(format(toWei('1.32456', 'ether'), circlesInceptionTimestamp, 4, roundDown)).toBe('3.9737');
    });
    
    it('should remove decimals for exact numbers by default', () => {
      const { toWei } = web3.utils;
      const format = formatCirclesValue;
      const circlesInceptionTimestamp = new Date("2020-10-15T00:00:00.000Z").getTime();

      expect(format(toWei('100', 'ether'), circlesInceptionTimestamp)).toBe('300');
      expect(format(toWei('100.00', 'ether'), circlesInceptionTimestamp)).toBe('300');      
    });
    
    it('will not remove decimals for exact numbers when roundDown is false', () => {
      const { toWei } = web3.utils;
      const format = formatCirclesValue;
      const circlesInceptionTimestamp = new Date("2020-10-15T00:00:00.000Z").getTime();
      const roundDown = false;

      expect(format(toWei('100', 'ether'), circlesInceptionTimestamp, 2, roundDown)).toBe('300.00');
      expect(format(toWei('100.00', 'ether'), circlesInceptionTimestamp, 2, roundDown)).toBe('300.00');
    });
  });
});
