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
import OpenAI from "openai";

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

About Ikoranabuhanga Rigezweho®:
- Mission: Nurture a young tech-savvy community equipped with digital skills, mentorship, and ethical ICT awareness
- Core Focus Areas:
  1. Digital Literacy Training - Hands-on ICT skills through practical learning
  2. ICT Career Guidance & Mentorship - Connecting students with tech professionals
  3. Community Engagement - Promoting responsible and ethical technology use

Impact:
- 1,500+ youth empowered through ICT programs
- 15+ partner schools
- 500+ mentorship connections
- Aligned with Rwanda NST2 and UN SDGs (SDG 4, 8, 9)

Contact Information:
- Founder: Joe Sure Gasore
- Phone: +250 788 331 033
- Email: info@ikoranabuhanga.tech
- Location: NR24, Rwanda

Your role is to:
1. Answer questions about technology, digital literacy, and ICT education
2. Provide information about Ikoranabuhanga Rigezweho's programs and mission
3. Guide users on how to get involved (partner, mentor, volunteer)
4. Share insights about Rwanda's digital transformation and NST2 goals
5. Be friendly, professional, and inspiring

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

  const httpServer = createServer(app);

  return httpServer;
}
