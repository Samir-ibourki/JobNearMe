import { Application, Job, User } from "../models/index.js";
import { AppError, asyncHandler } from "../middlewares/errorHandler.js";

export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;
  const candidateId = req.user.id;

  if (!jobId) throw new AppError("ID de l'offre requis", 400);

  const job = await Job.findByPk(jobId);
  if (!job) throw new AppError("Offre non trouvée", 404);

  const alreadyApplied = await Application.findOne({
    where: { userId: candidateId, jobId },
  });

  if (alreadyApplied) {
    throw new AppError("Vous avez déjà postulé à cette offre", 400);
  }

  const application = await Application.create({
    userId: candidateId,
    jobId,
    coverLetter,
    status: "pending",
  });

  res.status(201).json({
    success: true,
    message: "Candidature envoyée avec succès",
    data: application,
  });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: Job,
        include: [
          { model: User, as: "employer", attributes: ["fullname", "phone"] },
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
