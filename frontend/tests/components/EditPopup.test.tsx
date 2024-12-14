import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditPopup from "@/components/EditPopup";
import { notesService } from "@/app/api/notesService";

// Mock the notesService
jest.mock("@/app/api/notesService", () => ({
  notesService: {
    updateNote: jest.fn(),
  },
}));

describe("EditPopup", () => {
  const mockNote = {
    _id: "1",
    title: "Test Note",
    description: "Test Description",
    createdAt: "2023-07-25",
  };
  const mockOnClose = jest.fn();
  const mockOnChanged = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the EditPopup component", () => {
    render(
      <EditPopup
        note={mockNote}
        onClose={mockOnClose}
        onChanged={mockOnChanged}
      />
    );
    expect(screen.getByText("Edit Note")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("initializes with the note's title and description", () => {
    render(
      <EditPopup
        note={mockNote}
        onClose={mockOnClose}
        onChanged={mockOnChanged}
      />
    );

    expect(screen.getByLabelText("Title")).toHaveValue("Test Note");
    expect(screen.getByLabelText("Description")).toHaveValue(
      "Test Description"
    );
  });

  it("updates title and description when input changes", () => {
    render(
      <EditPopup
        note={mockNote}
        onClose={mockOnClose}
        onChanged={mockOnChanged}
      />
    );

    const titleInput = screen.getByLabelText("Title");
    const descriptionInput = screen.getByLabelText("Description");

    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Updated Description" },
    });

    expect(titleInput).toHaveValue("Updated Title");
    expect(descriptionInput).toHaveValue("Updated Description");
  });

  it("calls notesService.updateNote and onChanged when form is submitted successfully", async () => {
    (notesService.updateNote as jest.Mock).mockResolvedValue({});

    render(
      <EditPopup
        note={mockNote}
        onClose={mockOnClose}
        onChanged={mockOnChanged}
      />
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated Title" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Updated Description" },
    });
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(notesService.updateNote).toHaveBeenCalledWith("1", {
        title: "Updated Title",
        description: "Updated Description",
      });
      expect(mockOnChanged).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("shows error message when notesService.updateNote fails", async () => {
    (notesService.updateNote as jest.Mock).mockRejectedValue(
      new Error("Failed to update note")
    );

    render(
      <EditPopup
        note={mockNote}
        onClose={mockOnClose}
        onChanged={mockOnChanged}
      />
    );

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(screen.getByText("Failed to update note")).toBeInTheDocument();
    });
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(
      <EditPopup
        note={mockNote}
        onClose={mockOnClose}
        onChanged={mockOnChanged}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnClose).toHaveBeenCalled();
  });
});
