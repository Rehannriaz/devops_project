import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Page from "@/app/notes/page";
import { notesService } from "@/app/api/notesService";

// Mock the notesService
jest.mock("@/app/api/notesService", () => ({
  notesService: {
    getNotes: jest.fn(),
  },
}));

// Mock the components
jest.mock("@/components/Navbar", () => ({
  __esModule: true,
  default: () => <div data-testid="navbar" />,
}));

jest.mock("@/components/Note", () => ({
  __esModule: true,
  default: ({ title, description, onEdit }) => (
    <div data-testid="note">
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  ),
}));

jest.mock("@/components/AddPopup", () => ({
  __esModule: true,
  default: ({ onClose, onNoteCreated }) => (
    <div data-testid="add-popup">
      <button onClick={onClose}>Close</button>
      <button onClick={onNoteCreated}>Create</button>
    </div>
  ),
}));

jest.mock("@/components/EditPopup", () => ({
  __esModule: true,
  default: ({ note, onClose, onChanged }) => (
    <div data-testid="edit-popup">
      <h3>{note.title}</h3>
      <button onClick={onClose}>Close</button>
      <button onClick={onChanged}>Save</button>
    </div>
  ),
}));

describe("Notes Page", () => {
  const mockNotes = [
    {
      _id: "1",
      title: "Note 1",
      description: "Description 1",
      createdAt: "2023-01-01",
    },
    {
      _id: "2",
      title: "Note 2",
      description: "Description 2",
      createdAt: "2023-01-02",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (notesService.getNotes as jest.Mock).mockResolvedValue([]);
  });

  it("renders the navbar", async () => {
    await act(async () => {
      render(<Page />);
    });
    await waitFor(() => {
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });
  });

  it("fetches and displays notes", async () => {
    (notesService.getNotes as jest.Mock).mockResolvedValue(mockNotes);

    await act(async () => {
      render(<Page />);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("note")).toHaveLength(2);
      expect(screen.getByText("Note 1")).toBeInTheDocument();
      expect(screen.getByText("Note 2")).toBeInTheDocument();
    });
  });

  it("handles error when fetching notes fails", async () => {
    (notesService.getNotes as jest.Mock).mockRejectedValue(
      new Error("Fetch failed")
    );

    await act(async () => {
      render(<Page />);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch notes. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("opens and closes the add popup", async () => {
    await act(async () => {
      render(<Page />);
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText("add"));
    });
    expect(screen.getByTestId("add-popup")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("Close"));
    });
    expect(screen.queryByTestId("add-popup")).not.toBeInTheDocument();
  });

  it("opens and closes the edit popup", async () => {
    (notesService.getNotes as jest.Mock).mockResolvedValue(mockNotes);

    await act(async () => {
      render(<Page />);
    });

    await waitFor(() => {
      fireEvent.click(screen.getAllByText("Edit")[0]);
    });

    expect(screen.getByTestId("edit-popup")).toBeInTheDocument();
    expect(screen.getAllByText("Note 1")).toHaveLength(2);

    await act(async () => {
      fireEvent.click(screen.getByText("Close"));
    });
    expect(screen.queryByTestId("edit-popup")).not.toBeInTheDocument();
  });

  it("refreshes notes after creating a new note", async () => {
    const updatedNotes = [
      ...mockNotes,
      {
        _id: "3",
        title: "Note 3",
        description: "Description 3",
        createdAt: "2023-01-03",
      },
    ];

    (notesService.getNotes as jest.Mock)
      .mockResolvedValueOnce(mockNotes)
      .mockResolvedValueOnce(updatedNotes);

    await act(async () => {
      render(<Page />);
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("note")).toHaveLength(2);
    });

    await act(async () => {
      fireEvent.click(screen.getByLabelText("add"));
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Create"));
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("note")).toHaveLength(3);
      expect(screen.getByText("Note 3")).toBeInTheDocument();
    });
  });

  it("refreshes notes after editing a note", async () => {
    const updatedNotes = [
      { ...mockNotes[0], title: "Edited Note 1" },
      mockNotes[1],
    ];

    (notesService.getNotes as jest.Mock)
      .mockResolvedValueOnce(mockNotes)
      .mockResolvedValueOnce(updatedNotes);

    await act(async () => {
      render(<Page />);
    });

    await waitFor(() => {
      fireEvent.click(screen.getAllByText("Edit")[0]);
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Save"));
    });

    await waitFor(() => {
      expect(screen.getByText("Edited Note 1")).toBeInTheDocument();
    });
  });
});
