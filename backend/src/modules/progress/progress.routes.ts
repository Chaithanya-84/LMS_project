import { Router } from "express";
import * as progressController from "./progress.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/videos/:videoId", authMiddleware, progressController.getVideoProgress);
router.post("/videos/:videoId", authMiddleware, progressController.updateVideoProgress);
router.get("/subjects/:subjectId", authMiddleware, progressController.getSubjectProgress);

export default router;
