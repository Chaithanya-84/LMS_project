import { Router } from "express";
import * as videoController from "./video.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/:videoId", authMiddleware, videoController.getVideo);

export default router;
