import { InitialOptionsTsJest } from 'ts-jest';

const esModules = [].join('|');

export default {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
  testTimeout: 20000,
} as InitialOptionsTsJest;
