import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.mjs";
import logger from "../utils/logger.mjs";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    logger.warn("Signup failed: Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      logger.warn("Signup failed: User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    logger.info("User created successfully:", newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    logger.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn("Login failed: Missing email or password");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("Login failed: Invalid email or password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn("Login failed: Invalid email or password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    logger.info({ userId: user._id }, "User logged in successfully:");
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    logger.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  logger.info("User logged out");
  res.status(200).json({ message: "Logout successful" });
});

export default router;
