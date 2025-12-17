import express from "express";
import {
  applyToJob,
  getMyApplications,
} from "../controllers/applicationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/:jobId", applyToJob);

router.get("/my", getMyApplications);

export default router;
