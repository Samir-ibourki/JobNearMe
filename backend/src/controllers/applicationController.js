import { Application, Job, Notification, User } from "../models/index.js";
import { AppError, asyncHandler } from "../middlewares/errorHandler.js";
import Employer from "../models/Employer.js";
import { sendPushNotification } from "../utils/pushNotification.js";

export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;

  if (req.userType !== "user") {
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
  // create notification l'employer
  await Notification.create({
    userId: job.employerId,
    userType: "employer",
    type: "new_application",
    title: "New Application! 📩",
    message: `${req.user.fullname} applied to your job: ${job.title}`,
    relatedId: application.id,
    isRead: false,
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

export const getJobApplications = asyncHandler(async (req, res) => {
  if (req.userType !== "employer") {
    throw new AppError("Only employers can view job applications", 403);
  }
  const { jobId } = req.params;

  const job = await Job.findByPk(jobId);
  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.employerId !== req.user.id) {
    throw new AppError("You can only view applications for your own jobs", 403);
  }

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

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  if (req.userType !== "employer") {
    throw new AppError("Only employers can update application status", 403);
  }

  const { applicationId } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "accepted", "rejected"];
  if (!validStatuses.includes(status)) {
    throw new AppError(
      "Invalid status. Must be: pending, accepted, or rejected",
      400,
    );
  }

  // Find the application
  const application = await Application.findByPk(applicationId, {
    include: [{ model: Job, as: "job" }],
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  // Verify the employer owns this job
  if (application.job.employerId !== req.user.id) {
    throw new AppError(
      "You can only update applications for your own jobs",
      403,
    );
  }
  await Notification.create({
    userId: application.candidateId,
    userType: "user",
    type:
      status === "accepted" ? "application_accepted" : "application_rejected",
    title:
      status === "accepted" ? "Application Accepted!" : "Application Update",
    message: `Your application for "${application.job.title}" was ${status}`,
    relatedId: application.id,
    isRead: false,
  });
  // Send push notification to candidate
  const candidate = await User.findByPk(application.candidateId);
  if (candidate?.pushToken) {
    sendPushNotification(
      candidate.pushToken,
      status === "accepted" ? "Application Accepted! 🎉" : "Application Update",
      `Your application for "${application.job.title}" was ${status}`,
      {
        type:
          status === "accepted"
            ? "application_accepted"
            : "application_rejected",
        applicationId: application.id,
      },
    );
  }

  // Update the status
  application.status = status;
  await application.save();

  res.json({
    success: true,
    message: `Application ${status} successfully`,
    data: application,
  });
});
