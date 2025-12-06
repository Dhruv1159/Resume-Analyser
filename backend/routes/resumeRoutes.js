import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeController.js";
import { generateResumeReport } from "../controllers/reportController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Resume analysis
router.post("/analyze", upload.single("resume"), analyzeResume);

// Combined introduction + interview questions
router.post("/report", upload.single("resume"), generateResumeReport);

export default router;
