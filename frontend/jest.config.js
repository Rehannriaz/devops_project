const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  testMatch: ["<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/app/(.*)$": "<rootDir>/src/app/$1",
    "^next/navigation$": "<rootDir>/tests/__mocks__/next-navigation.js",
  },
  rootDir: "./",
};

module.exports = createJestConfig(customJestConfig);
