"use client";
import { useState, useEffect } from "react";
import { notesService } from "../app/api/notesService";

interface Note {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface EditPopupProps {
  note: Note;
  onClose: () => void;
  onChanged: () => void;
}

const EditPopup = ({ note, onClose, onChanged }: EditPopupProps) => {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(note.title);
    setDescription(note.description);
  }, [note]);

  const handleConfirm = async () => {
    try {
        await notesService.updateNote(note._id, { title, description });
        onChanged();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while editing the note."
      );
    }
  };

  return (
    <div className="bg-[rgba(0,0,0,0.9)] z-10 fixed top-0 left-0 w-full h-full">
      <div className="absolute top-1/2 left-1/2 bg-white transform -translate-x-1/2 -translate-y-1/2 w-1/2 z-20 rounded-2xl p-6">
        <h2 className="text-[#841bfd] text-[34px] font-bold text-center">
          Edit Note
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <label
          htmlFor="title"
          className="block text-[18px] text-black font-medium mt-4">
          Title
        </label>
        <input
          className="border border-black rounded-[6px] w-full p-1 mt-2 text-black"
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label
          htmlFor="description"
          className="block text-[18px] text-black font-medium mt-4">
          Description
        </label>
        <textarea
          className="border border-black rounded-[6px] w-full p-1 mt-2 text-black resize-none h-32"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="mt-6 flex justify-end gap-x-6">
          <button
            onClick={handleConfirm}
            className="px-4 py-1 bg-[#841bfd] text-white rounded-md hover:bg-[#7740b5]">
            Confirm
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-[#841bfd] text-white rounded-md hover:bg-[#7740b5]">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;