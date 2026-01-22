/**
 * Auth Controller Tests - Simplified
 * Tests l register, login, getProfile  
 */

import { jest, describe, it, expect, beforeAll, beforeEach } from "@jest/globals";

// Mocks
let mockBcrypt, mockUser, mockEmployer, register, login, getProfile, updateProfile;

beforeAll(async () => {
  // Mock bcrypt
  mockBcrypt = {
    hash: jest.fn(),
    compare: jest.fn(),
  };
  jest.unstable_mockModule("bcryptjs", () => ({
    default: mockBcrypt,
  }));

  // Mock jwt
  jest.unstable_mockModule("jsonwebtoken", () => ({
    default: {
      sign: jest.fn(() => "mocked-token"),
      verify: jest.fn(),
    },
  }));

  // Mock User
  mockUser = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
  };
  jest.unstable_mockModule("../models/User.js", () => ({
    default: mockUser,
  }));

  // Mock Employer
  mockEmployer = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
  };
  jest.unstable_mockModule("../models/Employer.js", () => ({
    default: mockEmployer,
  }));

  // Mock email service
  jest.unstable_mockModule("../utils/emailService.js", () => ({
    sendEmail: jest.fn(),
  }));

  // Mock error handler
  jest.unstable_mockModule("../middlewares/errorHandler.js", () => ({
    AppError: class AppError extends Error {
      constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
      }
    },
  }));

  // Mock sequelize
  jest.unstable_mockModule("sequelize", () => ({
    Op: { gt: Symbol("gt") },
  }));

  // Import controller after mocks
  const controller = await import("../controllers/authController.js");
  register = controller.register;
  login = controller.login;
  getProfile = controller.getProfile;
  updateProfile = controller.updateProfile;
});

// Helpers
const mockRequest = (body = {}, params = {}, user = null, userType = null) => ({
  body, params, user, userType,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

// Tests
describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register()", () => {
    it("should register a candidate successfully", async () => {
      const req = mockRequest({
        role: "candidate",
        fullname: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue("hashed-password");
      mockUser.create.mockResolvedValue({
        id: 1, role: "candidate", fullname: "Test User", email: "test@example.com",
      });

      await register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should throw error if email already exists", async () => {
      const req = mockRequest({
        fullname: "Test", email: "exists@test.com", password: "123",
      });
      const res = mockResponse();
      mockUser.findOne.mockResolvedValue({ id: 1 });

      await register(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should throw error if fields missing", async () => {
      const req = mockRequest({ fullname: "Test" }); // missing email, password
      const res = mockResponse();

      await register(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("login()", () => {
    it("should login successfully", async () => {
      const req = mockRequest({ email: "test@test.com", password: "pass" });
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue({
        id: 1, email: "test@test.com", password: "h", fullname: "Test",
      });
      mockBcrypt.compare.mockResolvedValue(true);

      await login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should throw error for wrong password", async () => {
      const req = mockRequest({ email: "test@test.com", password: "wrong" });
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue({ id: 1, password: "h" });
      mockBcrypt.compare.mockResolvedValue(false);

      await login(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should throw error if user not found", async () => {
      const req = mockRequest({ email: "no@test.com", password: "pass" });
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue(null);
      mockEmployer.findOne.mockResolvedValue(null);

      await login(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("getProfile()", () => {
    it("should return profile", async () => {
      const userData = {
        id: 1, fullname: "Test", email: "t@t.com",
        toJSON: () => ({ id: 1, fullname: "Test" }),
      };
      const req = mockRequest({}, {}, userData, "user");
      const res = mockResponse();

      await getProfile(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if no user", async () => {
      const req = mockRequest({}, {}, null);
      const res = mockResponse();

      await getProfile(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateProfile()", () => {
    it("should update profile", async () => {
      const userData = {
        id: 1, fullname: "Old",
        save: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ id: 1, fullname: "New" }),
      };
      const req = mockRequest({ fullname: "New" }, {}, userData, "user");
      const res = mockResponse();

      await updateProfile(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should throw error if no user", async () => {
      const req = mockRequest({ fullname: "X" }, {}, null);
      const res = mockResponse();

      await updateProfile(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
