import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger.mjs";

// Load environment variables
dotenv.config();

const dbURI =
  "mongodb://admin:password@mongodb:27017/NoteMaster?authSource=admin";
console.log("dbURI", dbURI);

const connectDB = async () => {
  try {
    if (!dbURI) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables"
      );
    }

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
