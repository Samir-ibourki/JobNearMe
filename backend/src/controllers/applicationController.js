import { Application, Job } from "../models/index.js";
import { AppError, asyncHandler } from "../middlewares/errorHandler.js";
import Employer from "../models/Employer.js";

export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;

  //only candidate can apply
  if (req.userType !== "candidate") {
    throw new AppError("Only candidates can apply to jobs", 403);
  }

  const candidateId = req.user.id;

  if (!jobId) throw new AppError("Job ID required", 400);

  const job = await Job.findByPk(jobId);
  if (!job) throw new AppError("Job not found", 404);

  const alreadyApplied = await Application.findOne({
    where: { candidateId, jobId },
  });

  if (alreadyApplied) {
    throw new AppError("You have already applied to this job", 400);
  }

  const application = await Application.create({
    candidateId,
    jobId,
    coverLetter,
    status: "pending",
  });

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    data: application,
  });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.findAll({
    where: { candidateId: req.user.id },
    include: [
      {
        model: Job,
        as: "job",
        include: [
          {
            model: Employer,
            as: "employer",
            attributes: ["fullname", "phone", "email"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

// employer: Get applications for a specific job
export const getJobApplications = asyncHandler(async (req, res) => {
  if (req.userType !== "employer") {
    throw new AppError("Only employers can view job applications", 403);
  }

  const { jobId } = req.params;

  //find the job and verify ownership
  const job = await Job.findByPk(jobId);
  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.employerId !== req.user.id) {
    throw new AppError("You can only view applications for your own jobs", 403);
  }

  // get all applications for this job
  const applications = await Application.findAll({
    where: { jobId },
    include: [
      {
        model: User,
        as: "candidate",
        attributes: ["id", "fullname", "email", "phone"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.json({
    success: true,
    count: applications.length,
    data: applications,
  });
});
