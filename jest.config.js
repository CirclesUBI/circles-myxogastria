module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/config/'],

  // Require .env file and additional setup
  setupFiles: ['dotenv/config'],

  // Resolve modules same as Webpack
  moduleNameMapper: {
    '^%(.*)$': '<rootDir>/test/mocks/fileMock.js',
    '^~(.*)$': '<rootDir>/src$1',
    locales$: '<rootDir>/locales/index.js',
  },
};
