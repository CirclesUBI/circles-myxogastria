import findAddress from '~/utils/findAddress';

describe('findAddress', () => {
  it('should find a valid address in a string', () => {
    const address = '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b';

    expect(findAddress(`https://circles.net/profile/${address}`)).toBe(address);

    expect(
      findAddress(`https://circles.net/profile/${address}/sub?test=42`),
    ).toBe(address);

    expect(findAddress(`.net/profile/${address}/sub?test=42`)).toBe(address);

    expect(findAddress(`0x0x0x${address}`)).toBe(address);

    expect(findAddress(`0x0x0x${address}`)).toBe(address);

    expect(findAddress(address)).toBe(address);

    expect(() => findAddress()).toThrow();

    expect(() => findAddress('Nothing to find here')).toThrow();

    expect(() => findAddress('https://circles.net/profile/0x321asd12321321311221321tqq'),
    ).toThrow();
  });
});
