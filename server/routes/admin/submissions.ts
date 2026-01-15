import { Router } from "express";
import { requireAuth } from "../../auth";
import { storage } from "../../storage";
import { logActivity } from "../../utils";

const router = Router();

// Get partner applications
router.get("/partners", requireAuth, async (req, res) => {
  try {
    const applications = await storage.getPartnerApplications();
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error("Error fetching partner applications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch partner applications" });
  }
});

// Get mentor applications
router.get("/mentors", requireAuth, async (req, res) => {
  try {
    const applications = await storage.getMentorApplications();
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error("Error fetching mentor applications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch mentor applications" });
  }
});

// Get volunteer applications
router.get("/volunteers", requireAuth, async (req, res) => {
  try {
    const applications = await storage.getVolunteerApplications();
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error("Error fetching volunteer applications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch volunteer applications" });
  }
});

// Get contact submissions
router.get("/contacts", requireAuth, async (req, res) => {
  try {
    const submissions = await storage.getContactSubmissions();
    res.json({ success: true, data: submissions });
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    res.status(500).json({ success: false, message: "Failed to fetch contact submissions" });
  }
});

// Bulk delete partner applications
router.post("/partners/bulk-delete", requireAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Invalid request format" });
    }
    await storage.bulkDeletePartnerApplications(ids);
    await logActivity(req, "bulk_delete_partner_applications", "partner_application", undefined, { count: ids.length });
    res.json({ success: true, message: "Partner applications deleted successfully" });
  } catch (error) {
    console.error("Error bulk deleting partner applications:", error);
    res.status(500).json({ success: false, message: "Failed to delete partner applications" });
  }
});

// Bulk delete mentor applications
router.post("/mentors/bulk-delete", requireAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Invalid request format" });
    }
    await storage.bulkDeleteMentorApplications(ids);
    await logActivity(req, "bulk_delete_mentor_applications", "mentor_application", undefined, { count: ids.length });
    res.json({ success: true, message: "Mentor applications deleted successfully" });
  } catch (error) {
    console.error("Error bulk deleting mentor applications:", error);
    res.status(500).json({ success: false, message: "Failed to delete mentor applications" });
  }
});

// Bulk delete volunteer applications
router.post("/volunteers/bulk-delete", requireAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Invalid request format" });
    }
    await storage.bulkDeleteVolunteerApplications(ids);
    await logActivity(req, "bulk_delete_volunteer_applications", "volunteer_application", undefined, { count: ids.length });
    res.json({ success: true, message: "Volunteer applications deleted successfully" });
  } catch (error) {
    console.error("Error bulk deleting volunteer applications:", error);
    res.status(500).json({ success: false, message: "Failed to delete volunteer applications" });
  }
});

// Bulk delete contact submissions
router.post("/contacts/bulk-delete", requireAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Invalid request format" });
    }
    await storage.bulkDeleteContactSubmissions(ids);
    await logActivity(req, "bulk_delete_contact_submissions", "contact_submission", undefined, { count: ids.length });
    res.json({ success: true, message: "Contact submissions deleted successfully" });
  } catch (error) {
    console.error("Error bulk deleting contact submissions:", error);
    res.status(500).json({ success: false, message: "Failed to delete contact submissions" });
  }
});

export default router;
