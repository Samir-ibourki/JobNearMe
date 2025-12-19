import express from "express";
import {
  applyToJob,
  getMyApplications,
} from "../controllers/applicationController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticateToken);
router.post("/:jobId", applyToJob);

router.get("/my", getMyApplications);

export default router;
