import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import apiKeyMiddleware from "./middleware/apiKeyMiddleware.mjs";
import { requestLogger } from "./middleware/authMiddleware.mjs";
import noteRoutes from "./routes/noteRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import connectDB from "./config/db.mjs";
import logger from "./utils/logger.mjs";

dotenv.config();

const app = express();

logger.info("Server is starting...");

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(apiKeyMiddleware);
app.use(requestLogger);

// Use the auth routes
app.use("/", authRoutes);

app.use("/notes", noteRoutes);

app.use(function (error, req, res, next) {
  logger.error("Unhandled error:", error);
  res
    .status(500)
    .json({ message: "An unexpected error occurred", error: error.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));

export default app;
