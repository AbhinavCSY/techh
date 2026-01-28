import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleVerifyPassword, handleGetDevPassword } from "./routes/auth";
import { initializePassword } from "./utils/password";

export function createServer() {
  const app = express();

  // Initialize password on first run
  initializePassword();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/verify-password", handleVerifyPassword);
  app.get("/api/dev-password", handleGetDevPassword);

  return app;
}
