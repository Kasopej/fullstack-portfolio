import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).+(ts|tsx|js)?(x)'],
};

export default config;
