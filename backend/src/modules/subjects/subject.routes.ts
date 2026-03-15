import { Router } from "express";
import * as subjectController from "./subject.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/", subjectController.listSubjects);
router.get("/:subjectId", subjectController.getSubject);
router.post("/:subjectId/enroll", authMiddleware, subjectController.enrollSubject);
router.get("/:subjectId/tree", authMiddleware, subjectController.getSubjectTree);
router.get("/:subjectId/first-video", authMiddleware, subjectController.getFirstVideo);

export default router;
