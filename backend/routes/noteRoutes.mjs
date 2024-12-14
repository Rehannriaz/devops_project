import express from "express";
import Note from "../models/note.mjs";
import { verifyToken } from "../middleware/authMiddleware.mjs";
import logger from "../utils/logger.mjs";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userid: req.userId });
    logger.info("Fetched notes successfully", { userId: req.userId, notes });
    res.status(200).json(notes);
  } catch (error) {
    logger.error("Error fetching notes:", error);
    res
      .status(500)
      .json({ message: "Error fetching notes", error: error.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    logger.warn("Note creation failed: Missing title or description");
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  try {
    const newNote = new Note({
      userid: req.userId,
      title,
      description,
    });

    await newNote.save();
    logger.info("Note created successfully", {
      userId: req.userId,
      note: newNote,
    });
    res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    logger.error("Error creating note:", error);
    res
      .status(500)
      .json({ message: "Error creating note", error: error.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title && !description) {
    logger.warn("Note update failed: Missing title and description");
    return res
      .status(400)
      .json({
        message:
          "At least one field (title or description) is required for update",
      });
  }

  try {
    const note = await Note.findOne({ _id: id, userid: req.userId });
    if (!note) {
      logger.warn("Note update failed: Note not found or no permission");
      return res
        .status(404)
        .json({
          message: "Note not found or you do not have permission to update it",
        });
    }

    if (title) note.title = title;
    if (description) note.description = description;

    await note.save();
    logger.info("Note updated successfully", { userId: req.userId, note });
    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    logger.error("Error updating note:", error);
    res
      .status(500)
      .json({ message: "Error updating note", error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findOneAndDelete({ _id: id, userid: req.userId });
    if (!note) {
      logger.warn("Note deletion failed: Note not found or no permission");
      return res
        .status(404)
        .json({
          message: "Note not found or you do not have permission to delete it",
        });
    }

    logger.info("Note deleted successfully", {
      userId: req.userId,
      noteId: id,
    });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    logger.error("Error deleting note:", error);
    res
      .status(500)
      .json({ message: "Error deleting note", error: error.message });
  }
});

export default router;
