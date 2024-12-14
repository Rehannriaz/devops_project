import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddPopup from "@/components/AddPopup";
import { notesService } from "@/app/api/notesService";

jest.mock("@/app/api/notesService", () => ({
  notesService: {
    addNote: jest.fn(),
  },
}));

describe("AddPopup", () => {
  const mockOnClose = jest.fn();
  const mockOnNoteCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the AddPopup component", () => {
    render(
      <AddPopup onClose={mockOnClose} onNoteCreated={mockOnNoteCreated} />
    );
    expect(screen.getByText("Add Note")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("updates title and description when input changes", () => {
    render(
      <AddPopup onClose={mockOnClose} onNoteCreated={mockOnNoteCreated} />
    );

    const titleInput = screen.getByLabelText("Title");
    const descriptionInput = screen.getByLabelText("Description");

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });

    expect(titleInput).toHaveValue("Test Title");
    expect(descriptionInput).toHaveValue("Test Description");
  });

  it("shows error message when title or description is empty", () => {
    render(
      <AddPopup onClose={mockOnClose} onNoteCreated={mockOnNoteCreated} />
    );

    fireEvent.click(screen.getByText("Confirm"));

    expect(
      screen.getByText("Title and description are required.")
    ).toBeInTheDocument();
  });

  it("calls notesService.addNote and onNoteCreated when form is submitted successfully", async () => {
    (notesService.addNote as jest.Mock).mockResolvedValue({});

    render(
      <AddPopup onClose={mockOnClose} onNoteCreated={mockOnNoteCreated} />
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(notesService.addNote).toHaveBeenCalledWith({
        title: "Test Title",
        description: "Test Description",
      });
      expect(mockOnNoteCreated).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("shows error message when notesService.addNote fails", async () => {
    (notesService.addNote as jest.Mock).mockRejectedValue(
      new Error("Failed to add note")
    );

    render(
      <AddPopup onClose={mockOnClose} onNoteCreated={mockOnNoteCreated} />
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(screen.getByText("Failed to add note")).toBeInTheDocument();
    });
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(
      <AddPopup onClose={mockOnClose} onNoteCreated={mockOnNoteCreated} />
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
