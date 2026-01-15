import { Router } from "express";
import authRoutes from "./auth";
import contactRoutes from "./contact";
import applicationsRoutes from "./applications";
import eventsRoutes from "./events";
import blogRoutes from "./blog";
import chatRoutes from "./chat";
import adminRoutes from "./admin";

const router = Router();

// Auth routes
router.use("/api/auth", authRoutes);

// Contact form
router.use("/api/contact", contactRoutes);

// Public contact submissions endpoint (legacy support)
router.get("/api/contact-submissions", async (req, res, next) => {
  // Forward to contact router
  req.url = "/submissions";
  contactRoutes(req, res, next);
});

// Application forms
router.use("/api", applicationsRoutes);

// Events (public)
router.use("/api/events", eventsRoutes);

// Blog (public)
router.use("/api/blog", blogRoutes);

// AI Chat
router.use("/api/chat", chatRoutes);

// Admin routes
router.use("/api/admin", adminRoutes);

// File upload route (special case - at root level)
router.post("/api/upload", (req, res, next) => {
  req.url = "/upload";
  const mediaRoutes = require("./admin/media").default;
  mediaRoutes(req, res, next);
});

export default router;
