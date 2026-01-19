import { jest } from "@jest/globals";

process.env.JWT_SECRET = "test-jwt-secret-key-12345";
process.env.JWT_EXPIRES_IN = "7d";
process.env.NODE_ENV = "test";

jest.setTimeout(10000);
