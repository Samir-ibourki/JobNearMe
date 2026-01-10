import express from "express";
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticateToken);
router.post("/:jobId", applyToJob);

router.get("/my", getMyApplications);
router.get("/job/:jobId", getJobApplications);
router.patch("/:applicationId/status", updateApplicationStatus);

export default router;
