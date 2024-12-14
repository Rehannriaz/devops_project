import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/login/page";
import { userService } from "@/app/api/userService";
import { useRouter } from "next/navigation";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the userService
jest.mock("@/app/api/userService", () => ({
  userService: {
    login: jest.fn(),
  },
}));

describe("Home (Login Page)", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders login form", () => {
    render(<Home />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    (userService.login as jest.Mock).mockResolvedValue({
      token: "fake-token",
      userId: "fake-user-id",
    });

    render(<Home />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(userService.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "fake-token");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "userId",
        "fake-user-id"
      );
      expect(mockPush).toHaveBeenCalledWith("/notes");
    });
  });

  it("handles login failure", async () => {
    (userService.login as jest.Mock).mockRejectedValue(
      new Error("Invalid credentials")
    );

    render(<Home />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("renders sign up link", () => {
    render(<Home />);
    const signUpLink = screen.getByRole("link", { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/signup");
  });
});
