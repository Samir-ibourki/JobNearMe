export default {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
  testPathIgnorePatterns: ["/node_modules/"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/config/**",
    "!src/seeders/**",
    "!**/node_modules/**",
  ],
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleFileExtensions: ["js", "json"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
