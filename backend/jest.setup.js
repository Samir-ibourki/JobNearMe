/**
 * Jest Setup File
 * Set environment variables before tests run
 */

// Set environment variables for testing
process.env.JWT_SECRET = "test-jwt-secret-key-12345";
process.env.JWT_EXPIRES_IN = "7d";
process.env.NODE_ENV = "test";
