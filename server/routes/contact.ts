import { Router } from "express";
import { storage } from "../storage";
import { insertContactSchema } from "@shared/schema";
import { sendContactEmail } from "../email";

const router = Router();

// Submit contact form
router.post("/", async (req, res) => {
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

// Get all contact submissions
router.get("/submissions", async (req, res) => {
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

export default router;
