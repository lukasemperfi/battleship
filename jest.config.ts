import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
    ".+\\.(png|jpg|jpeg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.svg": "<rootDir>/src/__mocks__/svgrMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
