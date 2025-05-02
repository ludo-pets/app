export default {
  preset: 'jest-expo',
  testMatch: ['**/*.steps.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};