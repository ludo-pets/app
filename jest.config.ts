/** @type {import('ts-jest').JestConfigWithTsJest} **/
import type {Config} from 'jest';

const config: Config = {
  preset: "jest-expo",
  verbose: true,
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  testMatch: [
    "**/tests/**/*.+(ts|tsx|js)",
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;