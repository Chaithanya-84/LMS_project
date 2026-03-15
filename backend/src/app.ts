import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import subjectRoutes from "./modules/subjects/subject.routes.js";
import videoRoutes from "./modules/videos/video.routes.js";
import progressRoutes from "./modules/progress/progress.routes.js";
import healthRoutes from "./modules/health/health.routes.js";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/health", healthRoutes);

app.use(errorHandler);

export default app;
