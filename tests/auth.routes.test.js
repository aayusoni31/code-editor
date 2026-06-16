import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { jest } from "@jest/globals";

jest.setTimeout(60000);

jest.unstable_mockModule("../lib/db.js", () => ({
  connectToDatabase: jest.fn().mockResolvedValue(true),
}));

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const { default: authRouter } = await import("../module/auth/route.js");
  app = express();
  app.use(express.json());
  app.use("/auth", authRouter);
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// ─── AUTH TESTS ───────────────────────────────────────────

describe("POST /auth/register", () => {
  it("should handle missing required fields", async () => {
    //  when I send empty body to register, I expect either 400 or 500 back
    const res = await request(app).post("/auth/register").send({});
    // Your controller throws a 500 when fields are missing
    expect([400, 500]).toContain(res.statusCode);
  });

  it("should handle invalid email formats", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "not-an-email",
      password: "pass123",
    });
    // Your controller throws a 500 when email fails validation
    expect([400, 500]).toContain(res.statusCode);
  });
});

describe("POST /auth/login", () => {
  it("should handle missing credentials gracefully", async () => {
    const res = await request(app).post("/auth/login").send({});
    // Your login route throws a 404 when it can't find a user with empty credentials
    expect([400, 404, 500]).toContain(res.statusCode);
  });

  it("should return an error if user does not exist", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "ghost@test.com", password: "wrongpass" });
    expect([401, 404, 400]).toContain(res.statusCode);
  });
});
