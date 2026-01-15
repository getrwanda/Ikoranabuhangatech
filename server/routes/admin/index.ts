import { Router } from "express";
import dashboardRoutes from "./dashboard";
import blogRoutes from "./blog";
import eventsRoutes from "./events";
import submissionsRoutes from "./submissions";
import studentsRoutes from "./students";
import mediaRoutes from "./media";

const router = Router();

// Dashboard, analytics, exports, activity logs
router.use("/", dashboardRoutes);

// Blog management
router.use("/blog", blogRoutes);

// Event management
router.use("/events", eventsRoutes);

// Submissions management
router.use("/submissions", submissionsRoutes);

// Students and mentor matches
router.use("/students", studentsRoutes);

// Mentor matches (top-level)
router.use("/mentor-matches", studentsRoutes);

// Media library
router.use("/media", mediaRoutes);

export default router;
