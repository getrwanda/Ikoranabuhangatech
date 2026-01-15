import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { db } from "./db";
import routes from "./routes/index";

export async function registerRoutes(app: Express): Promise<Server> {

  // Health check endpoint
  app.get("/health", async (_req, res) => {
    try {
      // Check database connection
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      console.error("Health check error:", error);
      res.status(503).json({
        status: "unhealthy",
        error: "Database connection failed",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Use modular routes
  app.use(routes);

  const httpServer = createServer(app);

  return httpServer;
}
