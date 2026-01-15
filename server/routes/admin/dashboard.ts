import { Router } from "express";
import { requireAuth } from "../../auth";
import { storage } from "../../storage";
import { cacheMiddleware } from "../../cache";
import { logActivity, toCSV } from "../../utils";

const router = Router();

// Dashboard statistics
router.get("/dashboard-stats", requireAuth, cacheMiddleware(300), async (req, res) => {
  try {
    const [blogCount, eventCount, partnerCount, mentorCount, volunteerCount, contactCount, studentsCount, matchesCount] = await Promise.all([
      storage.getBlogPostsCount(),
      storage.getEventsCount(),
      storage.getPartnerApplicationsCount(),
      storage.getMentorApplicationsCount(),
      storage.getVolunteerApplicationsCount(),
      storage.getContactSubmissionsCount(),
      storage.getStudentsCount(),
      storage.getMentorMatchesCount()
    ]);

    res.json({
      success: true,
      data: {
        blogPosts: blogCount,
        events: eventCount,
        partnerApplications: partnerCount,
        mentorApplications: mentorCount,
        volunteerApplications: volunteerCount,
        contactSubmissions: contactCount,
        students: studentsCount,
        mentorMatches: matchesCount
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard statistics" });
  }
});

// Dashboard comparison metrics
router.get("/dashboard-comparison", requireAuth, cacheMiddleware(300), async (req, res) => {
  try {
    const comparison = await storage.getComparisonMetrics();
    res.json({ success: true, data: comparison });
  } catch (error) {
    console.error("Error fetching comparison metrics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch comparison metrics" });
  }
});

// Timeline analytics
router.get("/analytics/timeline", requireAuth, cacheMiddleware(900), async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const timeline = await storage.getDailySubmissionCounts(days, startDate, endDate);
    res.json({ success: true, data: timeline });
  } catch (error) {
    console.error("Error fetching timeline analytics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch timeline analytics" });
  }
});

// Distribution analytics
router.get("/analytics/distribution", requireAuth, async (req, res) => {
  try {
    const [partnerCount, mentorCount, volunteerCount, contactCount] = await Promise.all([
      storage.getPartnerApplicationsCount(),
      storage.getMentorApplicationsCount(),
      storage.getVolunteerApplicationsCount(),
      storage.getContactSubmissionsCount(),
    ]);

    const distribution = [
      { name: "Partners", value: partnerCount, fill: "#0ea5e9" },
      { name: "Mentors", value: mentorCount, fill: "#8b5cf6" },
      { name: "Volunteers", value: volunteerCount, fill: "#f43f5e" },
      { name: "Contacts", value: contactCount, fill: "#10b981" },
    ];

    res.json({ success: true, data: distribution });
  } catch (error) {
    console.error("Error fetching distribution analytics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch distribution analytics" });
  }
});

// Export dashboard data
router.get("/export/dashboard", requireAuth, async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const days = req.query.days ? parseInt(req.query.days as string) : 30;

    const timeline = await storage.getDailySubmissionCounts(days, startDate, endDate);
    const csv = toCSV(timeline);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=dashboard-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);

    await logActivity(req, "Exported dashboard data", "analytics");
  } catch (error) {
    console.error("Error exporting dashboard data:", error);
    res.status(500).json({ success: false, message: "Failed to export data" });
  }
});

// Export partners
router.get("/export/partners", requireAuth, async (req, res) => {
  try {
    const partners = await storage.getPartnerApplications();
    const csv = toCSV(partners.map(p => ({
      id: p.id,
      name: p.name,
      email: p.email,
      phone: p.phone,
      organizationName: p.organizationName,
      organizationType: p.organizationType,
      location: p.location,
      partnershipGoals: p.partnershipGoals,
      resourceContribution: Array.isArray(p.resourceContribution) ? p.resourceContribution.join('; ') : p.resourceContribution,
      partnershipTimeline: p.partnershipTimeline,
      createdAt: p.createdAt
    })));

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=partner-applications-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);

    await logActivity(req, "Exported partner applications", "partners");
  } catch (error) {
    console.error("Error exporting partners:", error);
    res.status(500).json({ success: false, message: "Failed to export partners" });
  }
});

// Export mentors
router.get("/export/mentors", requireAuth, async (req, res) => {
  try {
    const mentors = await storage.getMentorApplications();
    const csv = toCSV(mentors.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      professionalTitle: m.professionalTitle,
      expertiseAreas: Array.isArray(m.expertiseAreas) ? m.expertiseAreas.join('; ') : m.expertiseAreas,
      yearsOfExperience: m.yearsOfExperience,
      availability: Array.isArray(m.availability) ? m.availability.join('; ') : m.availability,
      preferredFormat: m.preferredFormat,
      ageGroupPreference: m.ageGroupPreference,
      languages: Array.isArray(m.languages) ? m.languages.join('; ') : m.languages,
      createdAt: m.createdAt
    })));

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=mentor-applications-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);

    await logActivity(req, "Exported mentor applications", "mentors");
  } catch (error) {
    console.error("Error exporting mentors:", error);
    res.status(500).json({ success: false, message: "Failed to export mentors" });
  }
});

// Export volunteers
router.get("/export/volunteers", requireAuth, async (req, res) => {
  try {
    const volunteers = await storage.getVolunteerApplications();
    const csv = toCSV(volunteers.map(v => ({
      id: v.id,
      name: v.name,
      email: v.email,
      phone: v.phone,
      skills: Array.isArray(v.skills) ? v.skills.join('; ') : v.skills,
      availabilityFrequency: v.availabilityFrequency,
      timeCommitment: v.timeCommitment,
      locationFlexibility: v.locationFlexibility,
      interestAreas: Array.isArray(v.interestAreas) ? v.interestAreas.join('; ') : v.interestAreas,
      createdAt: v.createdAt
    })));

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=volunteer-applications-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);

    await logActivity(req, "Exported volunteer applications", "volunteers");
  } catch (error) {
    console.error("Error exporting volunteers:", error);
    res.status(500).json({ success: false, message: "Failed to export volunteers" });
  }
});

// Export contacts
router.get("/export/contacts", requireAuth, async (req, res) => {
  try {
    const contacts = await storage.getContactSubmissions();
    const csv = toCSV(contacts.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      message: c.message,
      createdAt: c.createdAt
    })));

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=contact-submissions-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);

    await logActivity(req, "Exported contact submissions", "contacts");
  } catch (error) {
    console.error("Error exporting contacts:", error);
    res.status(500).json({ success: false, message: "Failed to export contacts" });
  }
});

// Unread counts
router.get("/unread-counts", requireAuth, async (req, res) => {
  try {
    const counts = await storage.getRecentSubmissionCounts(24);
    res.json({ success: true, data: counts });
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    res.status(500).json({ success: false, message: "Failed to fetch unread counts" });
  }
});

// Activity logs
router.get("/activity-logs", requireAuth, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const logs = await storage.getActivityLogs(limit);
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch activity logs" });
  }
});

export default router;
