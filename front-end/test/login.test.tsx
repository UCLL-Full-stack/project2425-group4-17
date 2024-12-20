import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import UserLoginForm from "@components/users/UserLoginForm";
import UserService from "@services/UserService";
import { useRouter } from "next/router";

const user1 =
    [{id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    password: 'securepassword',
    role: 'user',
    reviews: [],
    articles: [],
    articleLikes: []}];
const user2 =({
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    password: 'securepassword',
    role: 'admin',
    reviews: [],
    articles: [],
    articleLikes: [],
});

let userService: jest.Mock;
userService: jest.fn()


// Mock the UserService
jest.mock("@services/UserService", () => ({
  loginUser: jest.fn(),
}));

describe("UserLoginForm Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it("renders the login form with fields and submit button", () => {
    render(<UserLoginForm />);
    expect(screen.getByLabelText(/Username/i));
    expect(screen.getByLabelText(/Password/i));
    expect(screen.getByText(/Login/i));
  });

  it("shows validation errors if fields are empty on submit", async () => {
    render(<UserLoginForm />);
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(screen.getByText(/Username is required/i));
      expect(screen.getByText(/Password is required/i));
    });
  });

  it("clears validation errors when inputs are corrected", async () => {
    render(<UserLoginForm />);
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(screen.getByText(/Username is required/i));
      expect(screen.getByText(/Password is required/i));
    });

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpassword" } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(!screen.queryByText(/Username is required/i));
      expect(!screen.queryByText(/Password is required/i));
    });
  });

  it("shows success message and redirects on successful login", async () => {
    (UserService.loginUser as jest.Mock).mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({
        token: "testtoken",
        fullname: "Test User",
        username: "testuser",
        role: "user",
      }),
    });

    render(<UserLoginForm />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpassword" } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(screen.getByText(/Login successful. Redirecting to home/i));
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("shows error message on failed login", async () => {
    (UserService.loginUser as jest.Mock).mockResolvedValue({
      status: 401,
      json: jest.fn().mockResolvedValue({ message: "Invalid credentials" }),
    });

    render(<UserLoginForm />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "wronguser" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i));
    });
  });

  it("shows a default error message if the server response lacks a message", async () => {
    (UserService.loginUser as jest.Mock).mockResolvedValue({
      status: 500,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<UserLoginForm />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "testpassword" } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(screen.getByText(/Failed to login/i));
    });
  });
});
