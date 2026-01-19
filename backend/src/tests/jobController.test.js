/**
 * Functions:
 * - getAllJobs: Return all jobs
 * - getJobById: Return single job
 * - getNearbyJobs: Return jobs near location
 * - createJob: Create new job (employer only)
 * - getEmployerJobs: Return employer's jobs
 * - deleteJob: Delete job (owner only)
 * - updateJob: Update job (owner only)
 * - getEmployerStats: Return employer dashboard stats
 */

import { jest, describe, it, expect, beforeEach } from "@jest/globals";


// MOCKS SETUP


// Mock Job model
const mockJob = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
};

// Mock Application model
const mockApplication = {
  count: jest.fn(),
  findAll: jest.fn(),
};

// Mock Employer model
const mockEmployer = {
  findOne: jest.fn(),
};

jest.unstable_mockModule("../models/index.js", () => ({
  Job: mockJob,
  Application: mockApplication,
}));

jest.unstable_mockModule("../models/Employer.js", () => ({
  default: mockEmployer,
}));

// Mock geocoding service
const mockGeocodeAddress = jest.fn();
jest.unstable_mockModule("../services/geocodingService.js", () => ({
  geocodeAddress: mockGeocodeAddress,
}));

// Mock haversine
jest.unstable_mockModule("../utils/haversine.js", () => ({
  default: jest.fn((lat1, lon1, lat2, lon2) => {

    return 5;
  }),
}));

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
  getAllJobs,
  getJobById,
  getNearbyJobs,
  createJob,
  getEmployerJobs,
  deleteJob,
  updateJob,
  getEmployerStats,
} = await import("../controllers/jobController.js");


// HELPER FUNCTIONS

const mockRequest = (
  body = {},
  params = {},
  query = {},
  user = null,
  userType = null
) => ({
  body,
  params,
  query,
  user,
  userType,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};


// TESTS


describe("Job Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  // GET ALL JOBS

  describe("getAllJobs()", () => {
    it("should return all jobs successfully", async () => {
      // ARRANGE
      const mockJobs = [
        { id: 1, title: "Job 1", city: "Casablanca" },
        { id: 2, title: "Job 2", city: "Rabat" },
      ];
      mockJob.findAll.mockResolvedValue(mockJobs);

      const req = mockRequest();
      const res = mockResponse();

      // ACT
      await getAllJobs(req, res);

      // ASSERT
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockJobs,
      });
    });

    it("should return empty array when no jobs exist", async () => {
      // ARRANGE
      mockJob.findAll.mockResolvedValue([]);
      const req = mockRequest();
      const res = mockResponse();

      // ACT
      await getAllJobs(req, res);

      // ASSERT
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 0,
        data: [],
      });
    });
  });


  // GET JOB BY ID

  describe("getJobById()", () => {
    it("should return job by id successfully", async () => {
      // ARRANGE
      const mockJobData = {
        id: 1,
        title: "Test Job",
        city: "Casablanca",
        employer: { fullname: "Company ABC" },
      };
      mockJob.findByPk.mockResolvedValue(mockJobData);

      const req = mockRequest({}, { id: 1 });
      const res = mockResponse();

      // ACT
      await getJobById(req, res);

      // ASSERT
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockJobData,
      });
    });

    it("should throw error if job not found", async () => {
      // ARRANGE
      mockJob.findByPk.mockResolvedValue(null);
      const req = mockRequest({}, { id: 999 });
      const res = mockResponse();

      // ACT & ASSERT
      await expect(getJobById(req, res)).rejects.toThrow();
    });
  });


  // GET NEARBY JOBS

  describe("getNearbyJobs()", () => {
    it("should return nearby jobs", async () => {
      // ARRANGE
      const mockJobs = [
        {
          id: 1,
          title: "Job 1",
          latitude: 33.5,
          longitude: -7.6,
          toJSON: () => ({ id: 1, title: "Job 1", latitude: 33.5, longitude: -7.6 }),
        },
      ];
      mockJob.findAll.mockResolvedValue(mockJobs);

      const req = mockRequest({}, {}, { lat: "33.5", lng: "-7.6", radius: "20" });
      const res = mockResponse();

      // ACT
      await getNearbyJobs(req, res);

      // ASSERT
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });

    it("should throw error if coordinates missing", async () => {
      // ARRANGE
      const req = mockRequest({}, {}, {}); // No lat/lng
      const res = mockResponse();

      // ACT & ASSERT
      await expect(getNearbyJobs(req, res)).rejects.toThrow();
    });
  });

 
  // CREATE JOB

  describe("createJob()", () => {
    it("should create job successfully for employer", async () => {
      // ARRANGE
      const jobData = {
        title: "New Job",
        description: "Job description",
        city: "Casablanca",
        salary: 5000,
        latitude: 33.5,
        longitude: -7.6,
      };
      const req = mockRequest(
        jobData,
        {},
        {},
        { id: 1 },
        "employer"
      );
      const res = mockResponse();

      mockJob.create.mockResolvedValue({
        id: 1,
        ...jobData,
        employerId: 1,
      });

      // ACT
      await createJob(req, res);

      // ASSERT
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });

    it("should throw error if not employer", async () => {
      // ARRANGE
      const req = mockRequest(
        { title: "Job" },
        {},
        {},
        { id: 1 },
        "user" // Not employer!
      );
      const res = mockResponse();

      // ACT & ASSERT
      await expect(createJob(req, res)).rejects.toThrow();
    });

    it("should throw error if required fields missing", async () => {
      // ARRANGE
      const req = mockRequest(
        { title: "Job" }, // Missing description and city
        {},
        {},
        { id: 1 },
        "employer"
      );
      const res = mockResponse();

      // ACT & ASSERT
      await expect(createJob(req, res)).rejects.toThrow();
    });
  });


  // GET EMPLOYER JOBS

  describe("getEmployerJobs()", () => {
    it("should return employer jobs", async () => {
      // ARRANGE
      const mockJobs = [
        { id: 1, title: "Job 1", employerId: 1 },
        { id: 2, title: "Job 2", employerId: 1 },
      ];
      mockJob.findAll.mockResolvedValue(mockJobs);

      const req = mockRequest({}, {}, {}, { id: 1 }, "employer");
      const res = mockResponse();

      // ACT
      await getEmployerJobs(req, res);

      // ASSERT
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockJobs,
      });
    });

    it("should throw error if not employer", async () => {
      // ARRANGE
      const req = mockRequest({}, {}, {}, { id: 1 }, "user");
      const res = mockResponse();

      // ACT & ASSERT
      await expect(getEmployerJobs(req, res)).rejects.toThrow();
    });
  });


  // DELETE JOB

  describe("deleteJob()", () => {
    it("should delete job successfully", async () => {
      // ARRANGE
      const mockJobData = {
        id: 1,
        title: "Job to delete",
        employerId: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      mockJob.findByPk.mockResolvedValue(mockJobData);

      const req = mockRequest({}, { id: 1 }, {}, { id: 1 }, "employer");
      const res = mockResponse();

      // ACT
      await deleteJob(req, res);

      // ASSERT
      expect(mockJobData.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Job deleted successfully",
      });
    });

    it("should throw error if job not found", async () => {
      // ARRANGE
      mockJob.findByPk.mockResolvedValue(null);
      const req = mockRequest({}, { id: 999 }, {}, { id: 1 }, "employer");
      const res = mockResponse();

      // ACT & ASSERT
      await expect(deleteJob(req, res)).rejects.toThrow();
    });

    it("should throw error if not job owner", async () => {
      // ARRANGE
      const mockJobData = {
        id: 1,
        employerId: 2, // Different employer!
      };
      mockJob.findByPk.mockResolvedValue(mockJobData);

      const req = mockRequest({}, { id: 1 }, {}, { id: 1 }, "employer");
      const res = mockResponse();

      // ACT & ASSERT
      await expect(deleteJob(req, res)).rejects.toThrow();
    });
  });


  // GET EMPLOYER STATS

  describe("getEmployerStats()", () => {
    it("should return employer stats", async () => {
      // ARRANGE
      mockJob.count.mockResolvedValue(5);
      mockJob.findAll.mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);
      mockApplication.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(3); 

      // Mock recent jobs with applications
      mockJob.findAll.mockResolvedValue([
        {
          id: 1,
          title: "Job 1",
          category: "IT",
          createdAt: new Date(),
          applications: [{ id: 1 }, { id: 2 }],
        },
      ]);

      const req = mockRequest({}, {}, {}, { id: 1 }, "employer");
      const res = mockResponse();

      // ACT
      await getEmployerStats(req, res);

      // ASSERT
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            stats: expect.any(Object),
          }),
        })
      );
    });

    it("should throw error if not employer", async () => {
      // ARRANGE
      const req = mockRequest({}, {}, {}, { id: 1 }, "user");
      const res = mockResponse();

      // ACT & ASSERT
      await expect(getEmployerStats(req, res)).rejects.toThrow();
    });
  });
});
