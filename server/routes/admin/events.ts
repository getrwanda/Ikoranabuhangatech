import { Router } from "express";
import { requireAuth } from "../../auth";
import { storage } from "../../storage";
import { insertEventSchema } from "@shared/schema";
import { logActivity } from "../../utils";

const router = Router();

// Get all events (admin)
router.get("/", requireAuth, async (req, res) => {
  try {
    const events = await storage.getAllEvents();
    res.json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching all events:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
});

// Create event
router.post("/", requireAuth, async (req, res) => {
  try {
    const validatedData = insertEventSchema.parse(req.body);
    const event = await storage.createEvent(validatedData);
    await logActivity(req, "create_event", "event", event.id, { title: event.title });
    res.json({ success: true, data: event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({ success: false, message: "Failed to create event" });
  }
});

// Update event
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const event = await storage.updateEvent(id, req.body);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    await logActivity(req, "update_event", "event", event.id, { title: event.title });
    res.json({ success: true, data: event });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(400).json({ success: false, message: "Failed to update event" });
  }
});

// Delete event
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteEvent(id);
    await logActivity(req, "delete_event", "event", id);
    res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
});

// Get event registrations
router.get("/:id/registrations", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const registrations = await storage.getEventRegistrations(id);
    res.json({ success: true, data: registrations });
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch registrations" });
  }
});

export default router;
