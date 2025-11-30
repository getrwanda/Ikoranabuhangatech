import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'contact', 'mentor', 'partner', 'volunteer'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const partnerApplications = pgTable("partner_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  organizationName: text("organization_name").notNull(),
  organizationType: text("organization_type").notNull(),
  location: text("location").notNull(),
  partnershipGoals: text("partnership_goals").notNull(),
  resourceContribution: text("resource_contribution").array().notNull(),
  partnershipTimeline: text("partnership_timeline").notNull(),
  pastCollaboration: text("past_collaboration"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mentorApplications = pgTable("mentor_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  professionalTitle: text("professional_title").notNull(),
  expertiseAreas: text("expertise_areas").array().notNull(),
  yearsOfExperience: text("years_of_experience").notNull(),
  availability: text("availability").array().notNull(),
  preferredFormat: text("preferred_format").notNull(),
  ageGroupPreference: text("age_group_preference").notNull(),
  languages: text("languages").array().notNull(),
  mentoringGoals: text("mentoring_goals").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const volunteerApplications = pgTable("volunteer_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  skills: text("skills").array().notNull(),
  availabilityFrequency: text("availability_frequency").notNull(),
  timeCommitment: text("time_commitment").notNull(),
  locationFlexibility: text("location_flexibility").notNull(),
  interestAreas: text("interest_areas").array().notNull(),
  previousExperience: text("previous_experience"),
  emergencyContact: text("emergency_contact"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'digital-literacy', 'mentorship', 'community-engagement'
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  capacity: integer("capacity").notNull(),
  registeredCount: integer("registered_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  organization: text("organization"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'success-stories', 'digital-literacy-tips', 'community-news', 'events-recap'
  author: text("author").notNull(),
  featuredImage: text("featured_image"),
  status: text("status").notNull().default('draft'), // 'draft' or 'published'
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  school: text("school").notNull(),
  grade: text("grade").notNull(),
  learningGoals: text("learning_goals").array().notNull(),
  interests: text("interests").array().notNull(),
  location: text("location").notNull(),
  parentContact: text("parent_contact"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mentorMatches = pgTable("mentor_matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mentorId: varchar("mentor_id").notNull().references(() => mentorApplications.id),
  studentId: varchar("student_id").notNull().references(() => students.id),
  status: text("status").notNull().default('active'), // 'active', 'completed', 'paused'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(), // 'login', 'logout', 'export', 'delete', 'create', 'update'
  resourceType: text("resource_type"), // 'partner', 'mentor', 'volunteer', 'contact', 'blog', 'event', etc.
  resourceId: varchar("resource_id"),
  details: text("details"), // JSON string with additional details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("Valid email is required"),
});

export const mentorApplicationSchema = insertContactSchema.extend({
  type: z.literal("mentor"),
});

export const partnerInquirySchema = insertContactSchema.extend({
  type: z.literal("partner"),
});

export const volunteerApplicationSchema = insertContactSchema.extend({
  type: z.literal("volunteer"),
});

export const insertPartnerApplicationSchema = createInsertSchema(partnerApplications).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().min(1, "Phone number is required"),
  organizationName: z.string().min(2, "Organization name is required"),
  organizationType: z.string().min(1, "Please select an organization type"),
  location: z.string().min(2, "Location is required"),
  partnershipGoals: z.string().min(10, "Please describe your partnership goals"),
  resourceContribution: z.array(z.string()).min(1, "Please select at least one resource type"),
  partnershipTimeline: z.string().min(1, "Please select a timeline"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const insertMentorApplicationSchema = createInsertSchema(mentorApplications).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().min(1, "Phone number is required"),
  professionalTitle: z.string().min(2, "Professional title is required"),
  expertiseAreas: z.array(z.string()).min(1, "Please select at least one expertise area"),
  yearsOfExperience: z.string().min(1, "Please select your experience level"),
  availability: z.array(z.string()).min(1, "Please select at least one availability option"),
  preferredFormat: z.string().min(1, "Please select a preferred format"),
  ageGroupPreference: z.string().min(1, "Please select an age group preference"),
  languages: z.array(z.string()).min(1, "Please select at least one language"),
  mentoringGoals: z.string().min(10, "Please describe your mentoring goals"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const insertVolunteerApplicationSchema = createInsertSchema(volunteerApplications).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().min(1, "Phone number is required"),
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  availabilityFrequency: z.string().min(1, "Please select your availability frequency"),
  timeCommitment: z.string().min(1, "Please select your time commitment"),
  locationFlexibility: z.string().min(1, "Please select your location flexibility"),
  interestAreas: z.array(z.string()).min(1, "Please select at least one area of interest"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  registeredCount: true,
}).extend({
  date: z.coerce.date(),
});

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
}).extend({
  publishedAt: z.coerce.date().nullable().optional(),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  school: z.string().min(2, "School name is required"),
  grade: z.string().min(1, "Grade is required"),
  learningGoals: z.array(z.string()).min(1, "Please select at least one learning goal"),
  interests: z.array(z.string()).min(1, "Please select at least one interest area"),
  location: z.string().min(2, "Location is required"),
});

export const insertMentorMatchSchema = createInsertSchema(mentorMatches).omit({
  id: true,
  createdAt: true,
}).extend({
  mentorId: z.string().min(1, "Mentor is required"),
  studentId: z.string().min(1, "Student is required"),
  status: z.enum(['active', 'completed', 'paused']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactSubmissions.$inferSelect;
export type MentorApplication = z.infer<typeof mentorApplicationSchema>;
export type PartnerInquiry = z.infer<typeof partnerInquirySchema>;
export type VolunteerApplication = z.infer<typeof volunteerApplicationSchema>;
export type InsertPartnerApplication = z.infer<typeof insertPartnerApplicationSchema>;
export type PartnerApplication = typeof partnerApplications.$inferSelect;
export type InsertMentorApplication = z.infer<typeof insertMentorApplicationSchema>;
export type MentorApplicationType = typeof mentorApplications.$inferSelect;
export type InsertVolunteerApplication = z.infer<typeof insertVolunteerApplicationSchema>;
export type VolunteerApplicationType = typeof volunteerApplications.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
export type InsertMentorMatch = z.infer<typeof insertMentorMatchSchema>;
export type MentorMatch = typeof mentorMatches.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
