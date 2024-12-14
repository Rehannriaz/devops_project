"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Note from "../../components/Note";
import AddPopup from "../../components/AddPopup";
import EditPopup from "../../components/EditPopup";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { notesService } from "../api/notesService";

interface Note {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

const Page = () => {
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const fetchedNotes = await notesService.getNotes();
      console.log("Fetched notes:", fetchedNotes);
      setNotes(fetchedNotes || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notes. Please try again.");
      console.error("Error fetching notes:", err);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleOpenPopup = () => {
    setIsAddPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsAddPopupOpen(false);
  };

  const handleOpenEditPopup = (note: Note) => {
    setSelectedNote(note);
    setIsEditPopupOpen(true);
  };

  const handleCloseEditPopup = () => {
    setSelectedNote(null);
    setIsEditPopupOpen(false);
  };

  const onNoteCreated = async () => {
    await fetchNotes();
    handleClosePopup();
  };

  const onChanged = async () => {
    await fetchNotes();
    handleCloseEditPopup();
  };

  const handleDeleteSuccess = (deletedNoteId: string) => {
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note._id !== deletedNoteId)
    );
  };

  return (
    <div>
      <Navbar />
      <div className="m-12 grid grid-cols-4 gap-4">
        {error && <p className="text-red-500">{error}</p>}
        {isLoading ? (
          <p>Loading notes...</p>
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <Note
              key={note._id}
              id={note._id}
              title={note.title}
              description={note.description}
              createdAt={note.createdAt}
              onDeleteSuccess={handleDeleteSuccess}
              onEdit={() => handleOpenEditPopup(note)}
            />
          ))
        ) : (
          <p>No notes found.</p>
        )}
      </div>
      <div className="fixed top-[86vh] right-[3vw]">
        <Fab
          aria-label="add"
          onClick={handleOpenPopup}
          sx={{
            backgroundColor: "#841bfd",
            "&:hover": {
              backgroundColor: "#6414ba",
            },
            color: "#ffffff",
          }}>
          <AddIcon />
        </Fab>
      </div>
      {isAddPopupOpen && (
        <AddPopup onClose={handleClosePopup} onNoteCreated={onNoteCreated} />
      )}
      {isEditPopupOpen && selectedNote && (
        <EditPopup
          note={selectedNote}
          onClose={handleCloseEditPopup}
          onChanged={onChanged}
        />
      )}
    </div>
  );
};

export default Page;
