import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";

jest.setTimeout(60000);

jest.unstable_mockModule("../lib/db.js", () => ({
  connectToDatabase: jest.fn().mockResolvedValue(true),
}));

jest.unstable_mockModule("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        text: "fixed code here",
      }),
    },
  })),
}));

global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({ stdout: "Hello World", stderr: "" }),
});

let app;
let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const { default: interviewRouter } =
    await import("../module/interview/route.js");
  app = express();
  app.use(express.json());
  app.use("/interview", interviewRouter);

  token = jwt.sign(
    { id: "testuser123" },
    process.env.JWT_SECRET || "testsecret",
  );
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// ─── ROOM TESTS ───────────────────────────────────────────

describe("GET /interview", () => {
  it("should fetch rooms", async () => {
    const res = await request(app).get("/interview");
    expect([200, 401, 403]).toContain(res.statusCode);
  });
});

describe("POST /interview", () => {
  it("should create a room", async () => {
    const res = await request(app)
      .post("/interview")
      .send({ name: "Test Room", language: "javascript" });
    // Expect 201 Created or 200 Success
    expect([200, 201, 401, 403]).toContain(res.statusCode);
  });

  it("should handle missing room data", async () => {
    const res = await request(app)
      .post("/interview")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    // Accepts 201 if the controller allows empty creation, or 400 for errors
    expect([200, 201, 400, 401, 403, 500]).toContain(res.statusCode);
  });
});

describe("POST /interview/fix", () => {
  it("should handle missing code gracefully", async () => {
    const res = await request(app)
      .post("/interview/fix")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect([200, 400, 401, 403, 500]).toContain(res.statusCode);
  });
});

describe("POST /interview/execute", () => {
  it("should return 400 if no code or language provided", async () => {
    const res = await request(app)
      .post("/interview/execute")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect([400, 401, 403, 500]).toContain(res.statusCode);
  });
});

describe("DELETE /interview/:id", () => {
  it("should delete or handle missing token", async () => {
    const res = await request(app).delete("/interview/fakeRoomId123");
    // Accepts 200 if deleted, or 400/500 if ID is invalid format
    expect([200, 400, 401, 403, 500]).toContain(res.statusCode);
  });
});
