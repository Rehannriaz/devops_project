import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/signup/page";
import { userService } from "@/app/api/userService";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/api/userService", () => ({
  userService: {
    signup: jest.fn(),
  },
}));

describe("Home (Signup Page)", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders signup form", () => {
    render(<Home />);
    expect(screen.getByLabelText(/^name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^username \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password \*/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("handles successful signup", async () => {
    (userService.signup as jest.Mock).mockResolvedValue({ success: true });

    render(<Home />);

    fireEvent.change(screen.getByLabelText(/^name \*/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/^username \*/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/^email \*/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password \*/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/^confirm password \*/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(userService.signup).toHaveBeenCalledWith({
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
      });
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("handles password mismatch", async () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText(/^name \*/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/^username \*/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/^email \*/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password \*/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/^confirm password \*/i), {
      target: { value: "password456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  it("handles signup failure", async () => {
    (userService.signup as jest.Mock).mockRejectedValue(
      new Error("Signup failed")
    );

    render(<Home />);

    fireEvent.change(screen.getByLabelText(/^name \*/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/^username \*/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/^email \*/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password \*/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/^confirm password \*/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Signup failed")).toBeInTheDocument();
    });
  });

  it("renders login link", () => {
    render(<Home />);
    const loginLink = screen.getByRole("link", { name: /log in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
