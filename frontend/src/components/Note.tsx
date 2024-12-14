import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { notesService } from "../app/api/notesService";

const Note = ({
  id,
  title,
  description,
  createdAt,
  onDeleteSuccess,
  onEdit
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handleDelete = async () => {
    try {
      await notesService.deleteNote(id);
      if (onDeleteSuccess) {
        onDeleteSuccess(id);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="overflow-hidden group bg-white border border-[#841bfd] shadow-[0_2px_10px_rgba(0,0,0,.15)] p-6 rounded-[12px] relative">
      <div className="flex justify-between">
        <h1 className="text-black font-bold text-[24px] uppercase">{title}</h1>
        <div className="flex gap-x-2">
          <div className="cursor-pointer" onClick={onEdit}>
            <EditIcon />
          </div>
          <div className="cursor-pointer" onClick={handleDelete}>
            <DeleteIcon />
          </div>
        </div>
      </div>
      <p className="text-black mt-2 text-base">{description}</p>
      <p className="mt-4 text-gray-400 text-[13px]">
        Created on {formatDate(createdAt)}
      </p>
    </div>
  );
};

export default Note;
