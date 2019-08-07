module.exports = {
  testEnvironment: 'jsdom',

  // Setup react-testing-library
  setupFilesAfterEnv: ['@testing-library/react/cleanup-after-each'],

  // Resolve modules same as Webpack
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/src$1',
  },
};
