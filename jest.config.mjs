/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  testMatch: [ "**/?(*.)+(test).cjs" ]
};

export default config;
