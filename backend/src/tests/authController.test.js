/**
 * Functions:
 * - register: Création dial user (candidate ou employer)
 * - login: Authentication dial user
 * - getProfile: Return user data
 * - forgotPassword: Send reset email
 * - resetPassword: Reset password b token
 * - updateProfile: Update user data
 */

import { jest, describe, it, expect, beforeEach } from "@jest/globals";


// 1️⃣ MOCKS SETUP


// Mock bcrypt - l password hashing
const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};
jest.unstable_mockModule("bcryptjs", () => ({
  default: mockBcrypt,
}));

// Mock jwt - l token generation
const mockJwt = {
  sign: jest.fn(() => "mocked-token-12345"),
  verify: jest.fn(),
};
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: mockJwt,
}));

// Mock User model
const mockUser = {
  create: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
};
jest.unstable_mockModule("../models/User.js", () => ({
  default: mockUser,
}));

// Mock Employer model
const mockEmployer = {
  create: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
};
jest.unstable_mockModule("../models/Employer.js", () => ({
  default: mockEmployer,
}));

// Mock email service
const mockSendEmail = jest.fn();
jest.unstable_mockModule("../utils/emailService.js", () => ({
  sendEmail: mockSendEmail,
}));

// Mock error handler
jest.unstable_mockModule("../middlewares/errorHandler.js", () => ({
  AppError: class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      this.isOperational = true;
    }
  },
}));

// Mock Sequelize operators
jest.unstable_mockModule("sequelize", () => ({
  Op: {
    gt: Symbol("gt"),
  },
}));


//  IMPORT CONTROLLER

const {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  updateProfile,
} = await import("../controllers/authController.js");


//  HELPER FUNCTIONS


// Create mock request
const mockRequest = (body = {}, params = {}, user = null, userType = null) => ({
  body,
  params,
  user,
  userType,
});

// Create mock response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function (error handler)
const mockNext = jest.fn();

// 4️⃣ TESTS


describe("Auth Controller", () => {
  // Reset all mocks b3d kol test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // REGISTER TESTS
  describe("register()", () => {
    it("should register a candidate successfully", async () => {
      // ARRANGE - Prépari data
      const req = mockRequest({
        role: "candidate",
        fullname: "Test User",
        email: "test@example.com",
        password: "password123",
        phone: "0612345678",
      });
      const res = mockResponse();

      // Mock User.findOne - ma kayn had email
      mockUser.findOne.mockResolvedValue(null);

      // Mock bcrypt.hash
      mockBcrypt.hash.mockResolvedValue("hashed-password");

      // Mock User.create - return new user
      mockUser.create.mockResolvedValue({
        id: 1,
        role: "candidate",
        fullname: "Test User",
        email: "test@example.com",
      });

      // ACT - Appeli register
      await register(req, res, mockNext);

      // ASSERT - Vérifii résultat
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "User created successfully",
          data: expect.objectContaining({
            user: expect.objectContaining({
              email: "test@example.com",
              fullname: "Test User",
            }),
          }),
        })
      );
    });

    it("should register an employer successfully", async () => {
      // ARRANGE
      const req = mockRequest({
        role: "employer",
        fullname: "Company ABC",
        email: "employer@company.com",
        password: "password123",
        city: "Casablanca",
        address: "123 Main Street",
      });
      const res = mockResponse();

      mockEmployer.findOne.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue("hashed-password");
      mockEmployer.create.mockResolvedValue({
        id: 1,
        fullname: "Company ABC",
        email: "employer@company.com",
      });

      // ACT
      await register(req, res, mockNext);

      // ASSERT
      expect(mockEmployer.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should throw error if email already exists", async () => {
      // ARRANGE
      const req = mockRequest({
        role: "candidate",
        fullname: "Test User",
        email: "existing@example.com",
        password: "password123",
      });
      const res = mockResponse();

      // User exists!
      mockUser.findOne.mockResolvedValue({ id: 1, email: "existing@example.com" });

      // ACT
      await register(req, res, mockNext);

      // ASSERT - Error passed to next()
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(409);
    });

    it("should throw error if required fields are missing", async () => {
      // ARRANGE - Missing password
      const req = mockRequest({
        fullname: "Test User",
        email: "test@example.com",
        // password is missing!
      });
      const res = mockResponse();

      // ACT
      await register(req, res, mockNext);

      // ASSERT
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(400);
    });

    it("should throw error for invalid email format", async () => {
      // ARRANGE
      const req = mockRequest({
        fullname: "Test User",
        email: "invalid-email", // Invalid!
        password: "password123",
      });
      const res = mockResponse();

      // ACT
      await register(req, res, mockNext);

      // ASSERT
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(400);
    });
  });

  // LOGIN TESTS
  describe("login()", () => {
    it("should login a user successfully", async () => {
      // ARRANGE
      const req = mockRequest({
        email: "test@example.com",
        password: "password123",
      });
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashed-password",
        role: "candidate",
        fullname: "Test User",
      });
      mockBcrypt.compare.mockResolvedValue(true);

      // ACT
      await login(req, res, mockNext);

      // ASSERT
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Login successful",
        })
      );
    });

    it("should login an employer successfully", async () => {
      // ARRANGE
      const req = mockRequest({
        email: "employer@company.com",
        password: "password123",
      });
      const res = mockResponse();

      // User not found, but Employer found
      mockUser.findOne.mockResolvedValue(null);
      mockEmployer.findOne.mockResolvedValue({
        id: 1,
        email: "employer@company.com",
        password: "hashed-password",
        fullname: "Company ABC",
      });
      mockBcrypt.compare.mockResolvedValue(true);

      // ACT
      await login(req, res, mockNext);

      // ASSERT
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should throw error for wrong password", async () => {
      // ARRANGE
      const req = mockRequest({
        email: "test@example.com",
        password: "wrongpassword",
      });
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashed-password",
      });
      mockBcrypt.compare.mockResolvedValue(false); // Wrong password!

      // ACT
      await login(req, res, mockNext);

      // ASSERT
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it("should throw error if user not found", async () => {
      // ARRANGE
      const req = mockRequest({
        email: "notfound@example.com",
        password: "password123",
      });
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue(null);
      mockEmployer.findOne.mockResolvedValue(null);

      // ACT
      await login(req, res, mockNext);

      // ASSERT
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it("should throw error if email or password missing", async () => {
      // ARRANGE - Missing password
      const req = mockRequest({
        email: "test@example.com",
      });
      const res = mockResponse();

      // ACT
      await login(req, res, mockNext);

      // ASSERT
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(400);
    });
  });

  // GET PROFILE TESTS
  describe("getProfile()", () => {
    it("should return user profile successfully", async () => {
      // ARRANGE
      const mockUserData = {
        id: 1,
        fullname: "Test User",
        email: "test@example.com",
        role: "candidate",
        toJSON: () => ({
          id: 1,
          fullname: "Test User",
          email: "test@example.com",
          role: "candidate",
        }),
      };
      const req = mockRequest({}, {}, mockUserData, "user");
      const res = mockResponse();

      // ACT
      await getProfile(req, res, mockNext);

      // ASSERT
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            fullname: "Test User",
          }),
        })
      );
    });

    it("should return 404 if user not found", async () => {
      // ARRANGE
      const req = mockRequest({}, {}, null);
      const res = mockResponse();

      // ACT
      await getProfile(req, res, mockNext);

      // ASSERT
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should set role to employer for employer users", async () => {
      // ARRANGE
      const mockEmployerData = {
        id: 1,
        fullname: "Company ABC",
        email: "employer@company.com",
        // No role field for employer!
        toJSON: () => ({
          id: 1,
          fullname: "Company ABC",
          email: "employer@company.com",
        }),
      };
      const req = mockRequest({}, {}, mockEmployerData, "employer");
      const res = mockResponse();

      // ACT
      await getProfile(req, res, mockNext);

      // ASSERT
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: "employer",
          }),
        })
      );
    });
  });

  // UPDATE PROFILE TESTS
  describe("updateProfile()", () => {
    it("should update profile successfully", async () => {
      // ARRANGE
      const mockUserData = {
        id: 1,
        fullname: "Old Name",
        phone: "0600000000",
        save: jest.fn().mockResolvedValue(true),
        toJSON: function () {
          return {
            id: this.id,
            fullname: this.fullname,
            phone: this.phone,
          };
        },
      };
      const req = mockRequest(
        { fullname: "New Name", phone: "0612345678" },
        {},
        mockUserData,
        "user"
      );
      const res = mockResponse();

      // ACT
      await updateProfile(req, res, mockNext);

      // ASSERT
      expect(mockUserData.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Profile updated successfully",
        })
      );
    });

    it("should throw error if user not found", async () => {
      // ARRANGE
      const req = mockRequest({ fullname: "New Name" }, {}, null);
      const res = mockResponse();

      // ACT
      await updateProfile(req, res, mockNext);

      // ASSERT
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error.statusCode).toBe(404);
    });
  });
});
