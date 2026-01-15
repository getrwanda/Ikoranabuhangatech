import { Router } from "express";
import { storage } from "../storage";
import {
  insertPartnerApplicationSchema,
  insertMentorApplicationSchema,
  insertVolunteerApplicationSchema
} from "@shared/schema";
import {
  sendPartnerApplicationEmail,
  sendMentorApplicationEmail,
  sendVolunteerApplicationEmail
} from "../email";

const router = Router();

// Partner application
router.post("/partner-inquiry", async (req, res) => {
  try {
    const validatedData = insertPartnerApplicationSchema.parse(req.body);

    const application = await storage.createPartnerApplication(validatedData);

    await sendPartnerApplicationEmail(validatedData);

    res.json({
      success: true,
      message: "Partnership inquiry submitted successfully",
      id: application.id
    });
  } catch (error) {
    console.error("Partner inquiry error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({
        success: false,
        message: "Invalid inquiry data",
        errors: error
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to process partnership inquiry"
      });
    }
  }
});

// Mentor application
router.post("/mentor-application", async (req, res) => {
  try {
    const validatedData = insertMentorApplicationSchema.parse(req.body);

    const application = await storage.createMentorApplication(validatedData);

    await sendMentorApplicationEmail(validatedData);

    res.json({
      success: true,
      message: "Mentor application submitted successfully",
      id: application.id
    });
  } catch (error) {
    console.error("Mentor application error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({
        success: false,
        message: "Invalid application data",
        errors: error
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to process mentor application"
      });
    }
  }
});

// Volunteer application
router.post("/volunteer-application", async (req, res) => {
  try {
    const validatedData = insertVolunteerApplicationSchema.parse(req.body);

    const application = await storage.createVolunteerApplication(validatedData);

    await sendVolunteerApplicationEmail(validatedData);

    res.json({
      success: true,
      message: "Volunteer application submitted successfully",
      id: application.id
    });
  } catch (error) {
    console.error("Volunteer application error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({
        success: false,
        message: "Invalid application data",
        errors: error
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to process volunteer application"
      });
    }
  }
});

export default router;
