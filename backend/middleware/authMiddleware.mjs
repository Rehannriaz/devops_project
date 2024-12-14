import jwt from "jsonwebtoken";
import logger from "../utils/logger.mjs";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  logger.info("Received token:", token);

  if (!token) {
    logger.warn("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error("Token verification error:", err);
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.userId;
    next();
  });
};

export const requestLogger = (req, res, next) => {
  const { method, url } = req;
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      {
        method,
        url,
        status: res.statusCode,
        duration: `${duration}ms`,
      },
      "HTTP Request"
    );
  });

  next();
};
