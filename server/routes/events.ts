import { Router } from "express";
import { storage } from "../storage";
import { insertEventRegistrationSchema } from "@shared/schema";
import { sendEventRegistrationEmail } from "../email";

const router = Router();

// List all events
router.get("/", async (req, res) => {
  try {
    const events = await storage.getEvents();
    res.json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events"
    });
  }
});

// Get upcoming events
router.get("/upcoming", async (req, res) => {
  try {
    const events = await storage.getUpcomingEvents();
    res.json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming events"
    });
  }
});

// Get event by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await storage.getEvent(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event"
    });
  }
});

// Register for event
router.post("/:id/register", async (req, res) => {
  try {
    const { id } = req.params;

    const event = await storage.getEvent(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    const validatedData = insertEventRegistrationSchema.parse({
      ...req.body,
      eventId: id
    });

    const incrementSuccess = await storage.incrementEventRegisteredCount(id);

    if (!incrementSuccess) {
      return res.status(400).json({
        success: false,
        message: "Event is full"
      });
    }

    let registration;
    try {
      registration = await storage.createEventRegistration(validatedData);
    } catch (registrationError) {
      console.error("Failed to create registration record, decrementing count:", registrationError);
      await storage.decrementEventRegisteredCount(id);
      throw registrationError;
    }

    const updatedEvent = await storage.getEvent(id);

    try {
      await sendEventRegistrationEmail({
        registration: validatedData,
        event: updatedEvent || event
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email, but registration succeeded:", emailError);
    }

    res.json({
      success: true,
      message: "Registration successful",
      id: registration.id
    });
  } catch (error) {
    console.error("Event registration error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({
        success: false,
        message: "Invalid registration data",
        errors: error
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to process event registration"
      });
    }
  }
});

export default router;
