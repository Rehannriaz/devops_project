import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { userService } from "@/app/api/userService";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the userService
jest.mock("@/app/api/userService", () => ({
  userService: {
    logout: jest.fn(),
  },
}));

describe("Navbar", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Navbar component", () => {
    render(<Navbar />);
    expect(screen.getByText("NotesMaster")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });

  it("has a link to the notes page", () => {
    render(<Navbar />);
    const link = screen.getByText("NotesMaster");
    expect(link).toHaveAttribute("href", "/notes");
  });

  it("calls handleLogout when the Log Out button is clicked", async () => {
    (userService.logout as jest.Mock).mockResolvedValue(undefined);

    render(<Navbar />);

    const logoutButton = screen.getByText("Log Out");
    fireEvent.click(logoutButton);

    expect(logoutButton).toBeDisabled();
    expect(screen.getByText("Logging out...")).toBeInTheDocument();

    await waitFor(() => {
      expect(userService.logout).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/login");
      expect(screen.getByText("Log Out")).toBeInTheDocument();
      expect(logoutButton).not.toBeDisabled();
    });
  });

  it("handles logout failure", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (userService.logout as jest.Mock).mockRejectedValue(
      new Error("Logout failed")
    );

    render(<Navbar />);

    const logoutButton = screen.getByText("Log Out");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(userService.logout).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Logout failed:",
        expect.any(Error)
      );
      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByText("Log Out")).toBeInTheDocument();
      expect(logoutButton).not.toBeDisabled();
    });

    consoleErrorSpy.mockRestore();
  });
});
