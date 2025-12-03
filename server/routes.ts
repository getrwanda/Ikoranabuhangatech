import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertContactSchema,
  mentorApplicationSchema,
  partnerInquirySchema,
  volunteerApplicationSchema,
  insertPartnerApplicationSchema,
  insertMentorApplicationSchema,
  insertVolunteerApplicationSchema,
  insertEventRegistrationSchema,
  insertEventSchema,
  insertBlogPostSchema,
  insertUserSchema,
  insertStudentSchema,
  insertMentorMatchSchema
} from "@shared/schema";
import {
  sendContactEmail,
  sendEventRegistrationEmail,
  sendPartnerApplicationEmail,
  sendMentorApplicationEmail,
  sendVolunteerApplicationEmail
} from "./email";
import OpenAI from "openai";
import passport from "passport";
import { requireAuth } from "./auth";
import { logActivity, toCSV } from "./utils";
import { authLimiter, adminLimiter } from "./middleware/rateLimiter";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for disk storage
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});
import { cacheMiddleware } from "./cache";
import { db } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {

  // Health check endpoint
  app.get("/health", async (_req, res) => {
    try {
      // Check database connection
      await db.select().from(storage.constructor.name as any).limit(1);
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      res.status(503).json({
        status: "unhealthy",
        error: "Database connection failed",
        timestamp: new Date().toISOString()
      });
    }
  });

  app.post("/api/auth/login", authLimiter, passport.authenticate("local"), (req, res) => {
    res.json({ success: true, user: req.user });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ success: true, user: req.user });
    } else {
      res.json({ success: false, user: null });
    }
  });

  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
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

  app.post("/api/partner-inquiry", async (req, res) => {
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

  app.post("/api/volunteer-application", async (req, res) => {
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

  app.get("/api/events", async (req, res) => {
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

  app.get("/api/events/upcoming", async (req, res) => {
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

  app.get("/api/events/:id", async (req, res) => {
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

  app.post("/api/events/:id/register", async (req, res) => {
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

  app.get("/api/blog/published", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json({ success: true, data: posts });
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch blog posts"
      });
    }
  });

  app.get("/api/blog/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const posts = await storage.getBlogPostsByCategory(category);
      res.json({ success: true, data: posts });
    } catch (error) {
      console.error("Error fetching blog posts by category:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch blog posts"
      });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Blog post not found"
        });
      }

      res.json({ success: true, data: post });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch blog post"
      });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({
          success: false,
          message: "Invalid request: messages array required"
        });
      }

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const systemPrompt = `You are Joesure, a helpful AI assistant for Ikoranabuhanga Rigezweho®, a Rwandan social enterprise focused on empowering youth through digital literacy, ICT mentorship, and responsible technology use.

ABOUT IKORANABUHANGA RIGEZWEHO®:
- Tagline: "Building Rwanda's Future through Digital Literacy and Mentorship"
- Mission: To equip Rwandan youth with digital skills and mentorship that enable them to succeed in the fast-changing digital economy
- Vision: A Rwanda where every young person is digitally literate, ethically aware, and empowered to contribute to national development through technology

CORE VALUES:
- Integrity: Promoting ethical and responsible ICT use
- Innovation: Encouraging creativity and problem-solving through technology
- Inclusion: Bridging the digital divide for all communities
- Collaboration: Partnering with schools, government, and NGOs for shared impact

PROGRAMS:

1. DIGITAL LITERACY CLUBS ("Ikoranabuhanga Clubs")
   Description: Hands-on ICT training clubs established in schools to build foundational digital skills, coding, and creativity
   Key Activities:
   - Weekly training sessions on computer basics, coding, design, and digital ethics
   - Peer-to-peer learning and mentorship
   - Monthly "Digital Challenges" and innovation contests
   - Toolkits and manuals provided for sustainability
   - University ICT students serve as mentors
   Expected Outcomes:
   - 1,000+ students trained in digital skills and ethics
   - Active, sustainable ICT clubs in 10-15 pilot schools
   - Improved collaboration and innovation among students
   Budget: $9,200 USD (includes training materials, facilitation, events, transport, monitoring)

2. ICT CAREER GUIDANCE & MENTORSHIP PROGRAM
   Description: Connecting students with ICT professionals and industry leaders through mentorship, career talks, and company visits
   Key Activities:
   - School-based ICT career days with industry speakers
   - Field visits to tech companies and innovation hubs
   - Online mentorship platform connecting students and mentors
   - Guidance on digital career pathways and entrepreneurship
   Expected Outcomes:
   - 500+ students mentored by ICT professionals
   - Increased awareness of ICT career paths
   - Stronger collaboration between schools and the ICT industry
   Budget: $7,300 USD (includes facilitation, platform development, events, transport, monitoring)

3. COMMUNITY ENGAGEMENT & AWARENESS
   Description: Raising awareness on digital safety, responsible use, and inclusive technology adoption
   Key Activities:
   - Digital Awareness Week campaigns
   - Workshops for parents and teachers
   - Community outreach events promoting responsible technology use

IMPACT STATISTICS:
- 1,500+ youth empowered through ICT programs
- 15+ partner schools
- 500+ mentorship connections
- 100% aligned with Rwanda NST2 and UN SDGs

ALIGNMENT WITH NATIONAL & GLOBAL GOALS:
Rwanda NST2 Pillars:
- Economic Transformation: Advancing development through technology
- Social Transformation: Equipping citizens with ICT skills
- Good Governance: Enhancing digital literacy for transparent and effective institutions

UN Sustainable Development Goals:
- SDG 4: Quality Education - ensuring equitable learning opportunities
- SDG 8: Decent Work and Economic Growth - enabling employability through digital skills
- SDG 9: Industry, Innovation, and Infrastructure - fostering creativity and infrastructure development

HOW TO GET INVOLVED:

1. PARTNER WITH US:
   - Schools, NGOs, and government agencies can collaborate to advance digital education
   - Partnership opportunities include providing resources, facilities, or technical support
   
2. BECOME A MENTOR:
   - ICT professionals and entrepreneurs can mentor students
   - Share knowledge and guide the next generation of tech leaders
   - Participate in career days, workshops, or online mentorship
   
3. VOLUNTEER OR DONATE:
   - Volunteer time to support training and mentorship activities
   - Financial contributions help expand access to technology and opportunity
   - In-kind donations (equipment, software licenses) are welcome

CONTACT INFORMATION:
- Founder & Project Lead: JOSHUA Gasore
- Phone: +250 788 331 033
- Email: info@ikoranabuhanga.tech
- Website: www.ikoranabuhanga.tech
- Location: NR24, Rwanda

YOUR ROLE AS JOESURE:
1. Answer questions about technology, digital literacy, and ICT education
2. Provide detailed information about our programs, budgets, and activities
3. Guide users on how to get involved (partner, mentor, volunteer, donate)
4. Share insights about Rwanda's digital transformation and NST2 goals
5. Help students understand ICT career pathways
6. Promote responsible and ethical technology use
7. Be friendly, professional, inspiring, and empowering

TONE & PERSONALITY:
- Inspirational and empowering, focused on youth potential
- Professional yet approachable
- Passionate about education and technology
- Supportive and encouraging
- Use concrete examples and impact stories when possible

Always be helpful, accurate, and supportive of youth empowerment through technology.`;

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();

    } catch (error) {
      console.error("Chat error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to process chat request"
        });
      } else {
        res.end();
      }
    }
  });

  app.get("/api/admin/dashboard-stats", requireAuth, cacheMiddleware(300), async (req, res) => {
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

  app.get("/api/admin/dashboard-comparison", requireAuth, cacheMiddleware(300), async (req, res) => {
    try {
      const comparison = await storage.getComparisonMetrics();
      res.json({ success: true, data: comparison });
    } catch (error) {
      console.error("Error fetching comparison metrics:", error);
      res.status(500).json({ success: false, message: "Failed to fetch comparison metrics" });
    }
  });

  app.get("/api/admin/analytics/timeline", requireAuth, cacheMiddleware(900), async (req, res) => {
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

  app.get("/api/admin/export/dashboard", requireAuth, async (req, res) => {
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

  // Export endpoints for submissions
  app.get("/api/admin/export/partners", requireAuth, async (req, res) => {
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

  app.get("/api/admin/export/mentors", requireAuth, async (req, res) => {
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

  app.get("/api/admin/export/volunteers", requireAuth, async (req, res) => {
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

  app.get("/api/admin/export/contacts", requireAuth, async (req, res) => {
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

  app.get("/api/admin/analytics/distribution", requireAuth, async (req, res) => {
    try {
      const [partnerCount, mentorCount, volunteerCount, contactCount] = await Promise.all([
        storage.getPartnerApplicationsCount(),
        storage.getMentorApplicationsCount(),
        storage.getVolunteerApplicationsCount(),
        storage.getContactSubmissionsCount(),
      ]);

      const distribution = [
        { name: "Partners", value: partnerCount, fill: "#0ea5e9" }, // sky-500
        { name: "Mentors", value: mentorCount, fill: "#8b5cf6" },   // violet-500
        { name: "Volunteers", value: volunteerCount, fill: "#f43f5e" }, // rose-500
        { name: "Contacts", value: contactCount, fill: "#10b981" }, // emerald-500
      ];

      res.json({ success: true, data: distribution });
    } catch (error) {
      console.error("Error fetching distribution analytics:", error);
      res.status(500).json({ success: false, message: "Failed to fetch distribution analytics" });
    }
  });

  app.get("/api/admin/blog", requireAuth, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json({ success: true, data: posts });
    } catch (error) {
      console.error("Error fetching all blog posts:", error);
      res.status(500).json({ success: false, message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/admin/blog/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }
      res.json({ success: true, data: post });
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ success: false, message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/admin/blog", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      await logActivity(req, "create_blog_post", "blog_post", post.id, { title: post.title });
      res.json({ success: true, data: post });
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ success: false, message: "Failed to create blog post" });
    }
  });

  app.patch("/api/admin/blog/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.updateBlogPost(id, req.body);
      if (!post) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }
      await logActivity(req, "update_blog_post", "blog_post", post.id, { title: post.title });
      res.json({ success: true, data: post });
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ success: false, message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBlogPost(id);
      await logActivity(req, "delete_blog_post", "blog_post", id);
      res.json({ success: true, message: "Blog post deleted" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ success: false, message: "Failed to delete blog post" });
    }
  });

  app.get("/api/admin/events", requireAuth, async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json({ success: true, data: events });
    } catch (error) {
      console.error("Error fetching all events:", error);
      res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
  });

  app.post("/api/admin/events", requireAuth, async (req, res) => {
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

  app.patch("/api/admin/events/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/admin/events/:id", requireAuth, async (req, res) => {
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

  app.get("/api/admin/events/:id/registrations", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const registrations = await storage.getEventRegistrations(id);
      res.json({ success: true, data: registrations });
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      res.status(500).json({ success: false, message: "Failed to fetch registrations" });
    }
  });

  app.get("/api/admin/submissions/partners", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getPartnerApplications();
      res.json({ success: true, data: applications });
    } catch (error) {
      console.error("Error fetching partner applications:", error);
      res.status(500).json({ success: false, message: "Failed to fetch partner applications" });
    }
  });

  app.get("/api/admin/submissions/mentors", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getMentorApplications();
      res.json({ success: true, data: applications });
    } catch (error) {
      console.error("Error fetching mentor applications:", error);
      res.status(500).json({ success: false, message: "Failed to fetch mentor applications" });
    }
  });

  app.get("/api/admin/submissions/volunteers", requireAuth, async (req, res) => {
    try {
      const applications = await storage.getVolunteerApplications();
      res.json({ success: true, data: applications });
    } catch (error) {
      console.error("Error fetching volunteer applications:", error);
      res.status(500).json({ success: false, message: "Failed to fetch volunteer applications" });
    }
  });

  app.get("/api/admin/submissions/contacts", requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json({ success: true, data: submissions });
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ success: false, message: "Failed to fetch contact submissions" });
    }
  });

  app.post("/api/admin/submissions/partners/bulk-delete", requireAuth, async (req, res) => {
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

  app.post("/api/admin/submissions/mentors/bulk-delete", requireAuth, async (req, res) => {
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

  app.post("/api/admin/submissions/volunteers/bulk-delete", requireAuth, async (req, res) => {
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

  app.post("/api/admin/submissions/contacts/bulk-delete", requireAuth, async (req, res) => {
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

  app.get("/api/admin/students", requireAuth, async (req, res) => {
    try {
      const students = await storage.getStudents();
      res.json({ success: true, data: students });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ success: false, message: "Failed to fetch students" });
    }
  });

  app.get("/api/admin/students/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const student = await storage.getStudent(id);
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }
      res.json({ success: true, data: student });
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ success: false, message: "Failed to fetch student" });
    }
  });

  app.post("/api/admin/students", requireAuth, async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(validatedData);
      await logActivity(req, "create_student", "student", student.id, { name: student.name });
      res.json({ success: true, data: student });
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(400).json({ success: false, message: "Failed to create student" });
    }
  });

  app.patch("/api/admin/students/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const student = await storage.updateStudent(id, req.body);
      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }
      await logActivity(req, "update_student", "student", student.id, { name: student.name });
      res.json({ success: true, data: student });
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(400).json({ success: false, message: "Failed to update student" });
    }
  });

  app.delete("/api/admin/students/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteStudent(id);
      await logActivity(req, "delete_student", "student", id);
      res.json({ success: true, message: "Student deleted" });
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ success: false, message: "Failed to delete student" });
    }
  });

  app.get("/api/admin/mentor-matches", requireAuth, async (req, res) => {
    try {
      const matches = await storage.getMentorMatches();
      res.json({ success: true, data: matches });
    } catch (error) {
      console.error("Error fetching mentor matches:", error);
      res.status(500).json({ success: false, message: "Failed to fetch mentor matches" });
    }
  });

  app.get("/api/admin/mentor-matches/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const match = await storage.getMentorMatch(id);
      if (!match) {
        return res.status(404).json({ success: false, message: "Match not found" });
      }
      res.json({ success: true, data: match });
    } catch (error) {
      console.error("Error fetching mentor match:", error);
      res.status(500).json({ success: false, message: "Failed to fetch mentor match" });
    }
  });

  app.post("/api/admin/mentor-matches", requireAuth, async (req, res) => {
    try {
      const validatedData = insertMentorMatchSchema.parse(req.body);
      const match = await storage.createMentorMatch(validatedData);
      res.json({ success: true, data: match });
    } catch (error) {
      console.error("Error creating mentor match:", error);
      res.status(400).json({ success: false, message: "Failed to create mentor match" });
    }
  });

  app.patch("/api/admin/mentor-matches/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertMentorMatchSchema.partial().parse(req.body);
      const match = await storage.updateMentorMatch(id, validatedData);
      if (!match) {
        return res.status(404).json({ success: false, message: "Match not found" });
      }
      res.json({ success: true, data: match });
    } catch (error) {
      console.error("Error updating mentor match:", error);
      res.status(400).json({ success: false, message: "Failed to update mentor match" });
    }
  });

  app.delete("/api/admin/mentor-matches/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteMentorMatch(id);
      res.json({ success: true, message: "Mentor match deleted" });
    } catch (error) {
      console.error("Error deleting mentor match:", error);
      res.status(500).json({ success: false, message: "Failed to delete mentor match" });
    }
  });

  app.get("/api/admin/unread-counts", requireAuth, async (req, res) => {
    try {
      const counts = await storage.getRecentSubmissionCounts(24);
      res.json({ success: true, data: counts });
    } catch (error) {
      console.error("Error fetching unread counts:", error);
      res.status(500).json({ success: false, message: "Failed to fetch unread counts" });
    }
  });

  app.get("/api/admin/activity-logs", requireAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getActivityLogs(limit);
      res.json({ success: true, data: logs });
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ success: false, message: "Failed to fetch activity logs" });
    }
  });

  // Media Library Endpoints
  app.post("/api/upload", requireAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const url = `/uploads/${req.file.filename}`;

      // Save file metadata to database
      const mediaFile = await storage.createMedia({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url,
      });

      await logActivity(req, "Uploaded media file", "media", mediaFile.id);

      res.json({ success: true, url, data: mediaFile });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ success: false, message: "Failed to upload file" });
    }
  });

  app.get("/api/admin/media", requireAuth, async (req, res) => {
    try {
      const files = await storage.getMediaFiles();
      res.json({ success: true, data: files });
    } catch (error) {
      console.error("Error fetching media files:", error);
      res.status(500).json({ success: false, message: "Failed to fetch media files" });
    }
  });

  app.delete("/api/admin/media/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      // Get file info before deleting from DB
      const files = await storage.getMediaFiles();
      const file = files.find(f => f.id === id);

      if (file) {
        // Delete from database
        await storage.deleteMedia(id);

        // Delete physical file
        const filePath = path.join(process.cwd(), "uploads", file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        await logActivity(req, "Deleted media file", "media", id);
      }

      res.json({ success: true, message: "Media file deleted" });
    } catch (error) {
      console.error("Error deleting media file:", error);
      res.status(500).json({ success: false, message: "Failed to delete media file" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
