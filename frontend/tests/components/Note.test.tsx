import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Note from "@/components/Note";
import { notesService } from "@/app/api/notesService";

// Mock the notesService
jest.mock("@/app/api/notesService", () => ({
  notesService: {
    deleteNote: jest.fn(),
  },
}));

// Mock MUI icons
jest.mock("@mui/icons-material/Edit", () => () => (
  <div data-testid="edit-icon" />
));
jest.mock("@mui/icons-material/Delete", () => () => (
  <div data-testid="delete-icon" />
));

describe("Note", () => {
  const mockProps = {
    id: "1",
    title: "Test Note",
    description: "This is a test note",
    createdAt: "2023-07-25T12:00:00Z",
    onDeleteSuccess: jest.fn(),
    onEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Note component with correct content", () => {
    render(<Note {...mockProps} />);

    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("This is a test note")).toBeInTheDocument();
    expect(screen.getByText(/Created on 25-07-2023/)).toBeInTheDocument();
    expect(screen.getByTestId("edit-icon")).toBeInTheDocument();
    expect(screen.getByTestId("delete-icon")).toBeInTheDocument();
  });

  it("calls onEdit when edit icon is clicked", () => {
    render(<Note {...mockProps} />);

    fireEvent.click(screen.getByTestId("edit-icon"));
    expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
  });

  it("calls notesService.deleteNote and onDeleteSuccess when delete icon is clicked", async () => {
    (notesService.deleteNote as jest.Mock).mockResolvedValue(undefined);

    render(<Note {...mockProps} />);

    fireEvent.click(screen.getByTestId("delete-icon"));

    await waitFor(() => {
      expect(notesService.deleteNote).toHaveBeenCalledWith("1");
      expect(mockProps.onDeleteSuccess).toHaveBeenCalledWith("1");
    });
  });

  it("handles delete error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (notesService.deleteNote as jest.Mock).mockRejectedValue(
      new Error("Delete failed")
    );

    render(<Note {...mockProps} />);

    fireEvent.click(screen.getByTestId("delete-icon"));

    await waitFor(() => {
      expect(notesService.deleteNote).toHaveBeenCalledWith("1");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error deleting note:",
        expect.any(Error)
      );
      expect(mockProps.onDeleteSuccess).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it("formats the date correctly", () => {
    const { rerender } = render(<Note {...mockProps} />);
    expect(screen.getByText(/Created on 25-07-2023/)).toBeInTheDocument();

    rerender(<Note {...mockProps} createdAt="2023-12-01T00:00:00Z" />);
    expect(screen.getByText(/Created on 01-12-2023/)).toBeInTheDocument();
  });
});
