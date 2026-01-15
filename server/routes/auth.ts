import { Router } from "express";
import passport from "passport";
import { requireAuth } from "../auth";
import { storage } from "../storage";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

// Login
router.post("/login", authLimiter, passport.authenticate("local"), (req, res) => {
  res.json({ success: true, user: req.user });
});

// Logout
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

// Get current user
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.json({ success: false, user: null });
  }
});

// Change password
router.post("/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user as any;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long"
      });
    }

    const dbUser = await storage.getUserByUsername(user.username);
    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const bcrypt = await import("bcrypt");
    const isValid = await bcrypt.compare(currentPassword, dbUser.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await storage.updateUserPassword(user.id, hashedPassword);

    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while changing password"
    });
  }
});

export default router;
