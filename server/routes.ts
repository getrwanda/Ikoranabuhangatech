import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  mentorApplicationSchema,
  partnerInquirySchema,
  volunteerApplicationSchema 
} from "@shared/schema";
import { sendContactEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse({
        ...req.body,
        type: "contact"
      });
      
      const contact = await storage.createContactSubmission(validatedData);
      
      await sendContactEmail(validatedData);
      
      res.json({ 
        success: true, 
        message: "Contact submission received successfully",
        id: contact.id 
      });
    } catch (error) {
      console.error("Contact submission error:", error);
      
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data",
          errors: error 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to process contact submission" 
        });
      }
    }
  });

  app.post("/api/mentor-application", async (req, res) => {
    try {
      const validatedData = mentorApplicationSchema.parse({
        ...req.body,
        type: "mentor"
      });
      
      const application = await storage.createContactSubmission(validatedData);
      
      await sendContactEmail(validatedData);
      
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

  app.post("/api/partner-inquiry", async (req, res) => {
    try {
      const validatedData = partnerInquirySchema.parse({
        ...req.body,
        type: "partner"
      });
      
      const inquiry = await storage.createContactSubmission(validatedData);
      
      await sendContactEmail(validatedData);
      
      res.json({ 
        success: true, 
        message: "Partnership inquiry submitted successfully",
        id: inquiry.id 
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

  app.post("/api/volunteer-application", async (req, res) => {
    try {
      const validatedData = volunteerApplicationSchema.parse({
        ...req.body,
        type: "volunteer"
      });
      
      const application = await storage.createContactSubmission(validatedData);
      
      await sendContactEmail(validatedData);
      
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

  app.get("/api/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json({ success: true, data: submissions });
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch contact submissions" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
