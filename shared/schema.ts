import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactSubmissions.$inferSelect;
export type MentorApplication = z.infer<typeof mentorApplicationSchema>;
export type PartnerInquiry = z.infer<typeof partnerInquirySchema>;
export type VolunteerApplication = z.infer<typeof volunteerApplicationSchema>;
