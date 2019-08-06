module.exports = {
  testEnvironment: 'node',

  // Setup Enzyme
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFilesAfterEnv: ['<rootDir>/test/setup-tests.js'],

  // Resolve modules same as Webpack
  moduleNameMapper: {
    '^~(.*)$': '<rootDir>/src$1',
  },
};
