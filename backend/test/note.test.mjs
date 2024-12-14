import { expect } from "chai";
import nock from "nock";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";

const API_BASE_URL = "http://api.example.com";

describe("API Tests", function () {
  let token;

  before(() => {
    nock.disableNetConnect();
  });

  after(() => {
    nock.enableNetConnect();
  });

  beforeEach(() => {
    nock.cleanAll();
    token = jwt.sign(
      { userId: "testUserId" },
      process.env.JWT_SECRET || "test_secret"
    );
  });

  it("should sign up a new user", async function () {
    const newUser = {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    nock(API_BASE_URL)
      .post("/signup")
      .reply(201, { message: "User created successfully" });

    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    expect(response.status).to.equal(201);
    const data = await response.json();
    expect(data.message).to.equal("User created successfully");
  });

  it("should login a user", async function () {
    const credentials = {
      email: "test@example.com",
      password: "password123",
    };

    nock(API_BASE_URL)
      .post("/login")
      .reply(200, { token: "mock_token", userId: "testUserId" });

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(data).to.have.property("token");
    expect(data).to.have.property("userId");
  });

  it("should logout a user", async function () {
    nock(API_BASE_URL)
      .post("/logout")
      .reply(200, { message: "Logout successful" });

    const response = await fetch(`${API_BASE_URL}/logout`, { method: "POST" });

    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(data.message).to.equal("Logout successful");
  });

  it("should get all notes", async function () {
    const mockNotes = [
      { _id: "1", title: "Note 1", description: "Description 1" },
      { _id: "2", title: "Note 2", description: "Description 2" },
    ];

    nock(API_BASE_URL)
      .get("/notes")
      .matchHeader("authorization", `Bearer ${token}`)
      .reply(200, mockNotes);

    const response = await fetch(`${API_BASE_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(data).to.deep.equal(mockNotes);
  });

  it("should create a new note", async function () {
    const newNote = {
      title: "New Note",
      description: "This is a new note",
    };

    nock(API_BASE_URL)
      .post("/notes")
      .matchHeader("authorization", `Bearer ${token}`)
      .reply(201, {
        message: "Note created successfully",
        note: { ...newNote, _id: "3" },
      });

    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    });

    expect(response.status).to.equal(201);
    const data = await response.json();
    expect(data.message).to.equal("Note created successfully");
    expect(data.note).to.include(newNote);
  });

  it("should update a note", async function () {
    const updatedNote = {
      title: "Updated Note",
      description: "This note has been updated",
    };

    nock(API_BASE_URL)
      .put("/notes/1")
      .matchHeader("authorization", `Bearer ${token}`)
      .reply(200, {
        message: "Note updated successfully",
        note: { ...updatedNote, _id: "1" },
      });

    const response = await fetch(`${API_BASE_URL}/notes/1`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    });

    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(data.message).to.equal("Note updated successfully");
    expect(data.note).to.include(updatedNote);
  });

  it("should delete a note", async function () {
    nock(API_BASE_URL)
      .delete("/notes/1")
      .matchHeader("authorization", `Bearer ${token}`)
      .reply(200, { message: "Note deleted successfully" });

    const response = await fetch(`${API_BASE_URL}/notes/1`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(data.message).to.equal("Note deleted successfully");
  });
});
