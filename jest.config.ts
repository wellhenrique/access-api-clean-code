/* eslint-disable @typescript-eslint/naming-convention */
import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    verbose: true,
    roots: ['<rootDir>/src', '<rootDir>/__tests__'],
    testEnvironment: 'node',
    transform: {
      '.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
      '@/(.*)': '<rootDir>/src/$1',
    },
    coverageThreshold: {
      global: {
        branches: 100,
      },
    },
  };
};
