module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/config/'],

  // Resolve modules same as Webpack
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/src$1',
  },
};
