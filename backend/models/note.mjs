import mongoose from "mongoose";

const { Schema } = mongoose;

// Note Schema
const noteSchema = new Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
