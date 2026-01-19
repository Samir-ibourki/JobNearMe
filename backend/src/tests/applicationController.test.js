/**
 * Functions:
 * - applyToJob: Candidate applies to job
 * - getMyApplications: Get candidate's applications
 * - getJobApplications: Get applications for a job (employer)
 * - updateApplicationStatus: Update application status (employer)
 */

import { jest, describe, it, expect, beforeEach } from "@jest/globals";

// MOCKS SETUP

// Mock Application model
const mockApplication = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
};

// Mock Job model
const mockJob = {
  findByPk: jest.fn(),
};

// Mock User model
const mockUser = {};

jest.unstable_mockModule("../models/index.js", () => ({
  Application: mockApplication,
  Job: mockJob,
  User: mockUser,
}));

// Mock Employer model
jest.unstable_mockModule("../models/Employer.js", () => ({
  default: {},
}));

// Mock error handler
const AppError = class extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
};

jest.unstable_mockModule("../middlewares/errorHandler.js", () => ({
  AppError,
  asyncHandler: (fn) => fn,
}));

// IMPORT CONTROLLER
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = await import("../controllers/applicationController.js");

//  HELPER FUNCTIONS
const mockRequest = (
  body = {},
  params = {},
  user = null,
  userType = null
) => ({
  body,
  params,
  user,
  userType,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

//TESTS

describe("Application Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // APPLY TO JOB
  describe("applyToJob()", () => {
    it("should apply to job successfully", async () => {
      // ARRANGE
      const req = mockRequest(
        { jobId: 1, coverLetter: "I am interested in this job" },
        {},
        { id: 1 },
        "user"
      );
      const res = mockResponse();

      // Job exists
      mockJob.findByPk.mockResolvedValue({ id: 1, title: "Test Job" });
      // Not already applied
      mockApplication.findOne.mockResolvedValue(null);
      // Create application
      mockApplication.create.mockResolvedValue({
        id: 1,
        candidateId: 1,
        jobId: 1,
        coverLetter: "I am interested in this job",
        status: "pending",
      });

      // ACT
      await applyToJob(req, res);

      // ASSERT
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Application submitted successfully",
        })
      );
    });

    it("should throw error if not a candidate", async () => {
      // ARRANGE
      const req = mockRequest(
        { jobId: 1 },
        {},
        { id: 1 },
        "employer" // Not user!
      );
      const res = mockResponse();

      // ACT & ASSERT
      await expect(applyToJob(req, res)).rejects.toThrow();
    });

    it("should throw error if already applied", async () => {
      // ARRANGE
      const req = mockRequest({ jobId: 1 }, {}, { id: 1 }, "user");
      const res = mockResponse();

      mockJob.findByPk.mockResolvedValue({ id: 1 });
      mockApplication.findOne.mockResolvedValue({ id: 1 }); // Already exists!

      // ACT & ASSERT
      await expect(applyToJob(req, res)).rejects.toThrow();
    });

    it("should throw error if job not found", async () => {
      // ARRANGE
      const req = mockRequest({ jobId: 999 }, {}, { id: 1 }, "user");
      const res = mockResponse();

      mockJob.findByPk.mockResolvedValue(null);

      // ACT & ASSERT
      await expect(applyToJob(req, res)).rejects.toThrow();
    });

    it("should throw error if jobId missing", async () => {
      // ARRANGE
      const req = mockRequest({}, {}, { id: 1 }, "user"); // No jobId
      const res = mockResponse();

      // ACT & ASSERT
      await expect(applyToJob(req, res)).rejects.toThrow();
    });
  });

  // GET MY APPLICATIONS
  describe("getMyApplications()", () => {
    it("should return candidate applications", async () => {
      // ARRANGE
      const mockApplications = [
        {
          id: 1,
          jobId: 1,
          status: "pending",
          job: { title: "Job 1" },
        },
        {
          id: 2,
          jobId: 2,
          status: "accepted",
          job: { title: "Job 2" },
        },
      ];
      mockApplication.findAll.mockResolvedValue(mockApplications);

      const req = mockRequest({}, {}, { id: 1 }, "user");
      const res = mockResponse();

      // ACT
      await getMyApplications(req, res);

      // ASSERT
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockApplications,
      });
    });

    it("should return empty array if no applications", async () => {
      // ARRANGE
      mockApplication.findAll.mockResolvedValue([]);
      const req = mockRequest({}, {}, { id: 1 }, "user");
      const res = mockResponse();

      // ACT
      await getMyApplications(req, res);

      // ASSERT
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 0,
        data: [],
      });
    });
  });

  // GET JOB APPLICATIONS
  describe("getJobApplications()", () => {
    it("should return job applications for employer", async () => {
      // ARRANGE
      const mockApplications = [
        { id: 1, candidateId: 1, status: "pending" },
        { id: 2, candidateId: 2, status: "pending" },
      ];
      mockJob.findByPk.mockResolvedValue({ id: 1, employerId: 1 });
      mockApplication.findAll.mockResolvedValue(mockApplications);

      const req = mockRequest({}, { jobId: 1 }, { id: 1 }, "employer");
      const res = mockResponse();

      // ACT
      await getJobApplications(req, res);

      // ASSERT
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockApplications,
      });
    });

    it("should throw error if not employer", async () => {
      // ARRANGE
      const req = mockRequest({}, { jobId: 1 }, { id: 1 }, "user");
      const res = mockResponse();

      // ACT & ASSERT
      await expect(getJobApplications(req, res)).rejects.toThrow();
    });

    it("should throw error if job not found", async () => {
      // ARRANGE
      mockJob.findByPk.mockResolvedValue(null);
      const req = mockRequest({}, { jobId: 999 }, { id: 1 }, "employer");
      const res = mockResponse();

      // ACT & ASSERT
      await expect(getJobApplications(req, res)).rejects.toThrow();
    });

    it("should throw error if not job owner", async () => {
      // ARRANGE
      mockJob.findByPk.mockResolvedValue({ id: 1, employerId: 2 }); // Different owner!
      const req = mockRequest({}, { jobId: 1 }, { id: 1 }, "employer");
      const res = mockResponse();

      // ACT & ASSERT
      await expect(getJobApplications(req, res)).rejects.toThrow();
    });
  });

  // UPDATE APPLICATION STATUS
  describe("updateApplicationStatus()", () => {
    it("should update application status successfully", async () => {
      // ARRANGE
      const mockApplicationData = {
        id: 1,
        status: "pending",
        job: { id: 1, employerId: 1 },
        save: jest.fn().mockResolvedValue(true),
      };
      mockApplication.findByPk.mockResolvedValue(mockApplicationData);

      const req = mockRequest(
        { status: "accepted" },
        { applicationId: 1 },
        { id: 1 },
        "employer"
      );
      const res = mockResponse();

      // ACT
      await updateApplicationStatus(req, res);

      // ASSERT
      expect(mockApplicationData.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Application accepted successfully",
        })
      );
    });

    it("should throw error for invalid status", async () => {
      // ARRANGE
      const req = mockRequest(
        { status: "invalid_status" }, // Invalid!
        { applicationId: 1 },
        { id: 1 },
        "employer"
      );
      const res = mockResponse();

      // ACT & ASSERT
      await expect(updateApplicationStatus(req, res)).rejects.toThrow();
    });

    it("should throw error if not employer", async () => {
      // ARRANGE
      const req = mockRequest(
        { status: "accepted" },
        { applicationId: 1 },
        { id: 1 },
        "user"
      );
      const res = mockResponse();

      // ACT & ASSERT
      await expect(updateApplicationStatus(req, res)).rejects.toThrow();
    });

    it("should throw error if application not found", async () => {
      // ARRANGE
      mockApplication.findByPk.mockResolvedValue(null);
      const req = mockRequest(
        { status: "accepted" },
        { applicationId: 999 },
        { id: 1 },
        "employer"
      );
      const res = mockResponse();

      // ACT & ASSERT
      await expect(updateApplicationStatus(req, res)).rejects.toThrow();
    });

    it("should throw error if not job owner", async () => {
      // ARRANGE
      const mockApplicationData = {
        id: 1,
        job: { id: 1, employerId: 2 }, // Different owner!
      };
      mockApplication.findByPk.mockResolvedValue(mockApplicationData);

      const req = mockRequest(
        { status: "accepted" },
        { applicationId: 1 },
        { id: 1 },
        "employer"
      );
      const res = mockResponse();

      // ACT & ASSERT
      await expect(updateApplicationStatus(req, res)).rejects.toThrow();
    });
  });
});
