import { 
  users, 
  contactSubmissions, 
  events, 
  eventRegistrations, 
  blogPosts,
  partnerApplications,
  mentorApplications,
  volunteerApplications,
  type User, 
  type InsertUser, 
  type Contact, 
  type InsertContact, 
  type Event, 
  type InsertEvent, 
  type EventRegistration, 
  type InsertEventRegistration, 
  type BlogPost, 
  type InsertBlogPost,
  type PartnerApplication,
  type InsertPartnerApplication,
  type MentorApplicationType,
  type InsertMentorApplication,
  type VolunteerApplicationType,
  type InsertVolunteerApplication
} from "@shared/schema";
import { db } from "./db";
import { eq, gte, sql, asc, desc, isNotNull } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(contact: InsertContact): Promise<Contact>;
  getContactSubmissions(): Promise<Contact[]>;
  getContactSubmissionsCount(): Promise<number>;
  createPartnerApplication(application: InsertPartnerApplication): Promise<PartnerApplication>;
  getPartnerApplications(): Promise<PartnerApplication[]>;
  getPartnerApplicationsCount(): Promise<number>;
  createMentorApplication(application: InsertMentorApplication): Promise<MentorApplicationType>;
  getMentorApplications(): Promise<MentorApplicationType[]>;
  getMentorApplicationsCount(): Promise<number>;
  createVolunteerApplication(application: InsertVolunteerApplication): Promise<VolunteerApplicationType>;
  getVolunteerApplications(): Promise<VolunteerApplicationType[]>;
  getVolunteerApplicationsCount(): Promise<number>;
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;
  getAllEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  getUpcomingEvents(): Promise<Event[]>;
  getEventsCount(): Promise<number>;
  updateEvent(id: string, data: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<void>;
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
  getEventRegistrations(eventId: string): Promise<EventRegistration[]>;
  incrementEventRegisteredCount(eventId: string): Promise<boolean>;
  decrementEventRegisteredCount(eventId: string): Promise<void>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPosts(): Promise<BlogPost[]>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  getBlogPostsCount(): Promise<number>;
  updateBlogPost(id: string, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactSubmission(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contactSubmissions)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getContactSubmissions(): Promise<Contact[]> {
    return await db.select().from(contactSubmissions);
  }

  async createPartnerApplication(insertApplication: InsertPartnerApplication): Promise<PartnerApplication> {
    const [application] = await db
      .insert(partnerApplications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getPartnerApplications(): Promise<PartnerApplication[]> {
    return await db
      .select()
      .from(partnerApplications)
      .orderBy(desc(partnerApplications.createdAt));
  }

  async createMentorApplication(insertApplication: InsertMentorApplication): Promise<MentorApplicationType> {
    const [application] = await db
      .insert(mentorApplications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getMentorApplications(): Promise<MentorApplicationType[]> {
    return await db
      .select()
      .from(mentorApplications)
      .orderBy(desc(mentorApplications.createdAt));
  }

  async createVolunteerApplication(insertApplication: InsertVolunteerApplication): Promise<VolunteerApplicationType> {
    const [application] = await db
      .insert(volunteerApplications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getVolunteerApplications(): Promise<VolunteerApplicationType[]> {
    return await db
      .select()
      .from(volunteerApplications)
      .orderBy(desc(volunteerApplications.createdAt));
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(asc(events.date), asc(events.title));
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(gte(events.date, sql`CURRENT_DATE`))
      .orderBy(asc(events.date), asc(events.title));
  }

  async createEventRegistration(insertRegistration: InsertEventRegistration): Promise<EventRegistration> {
    const [registration] = await db
      .insert(eventRegistrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    return await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, eventId))
      .orderBy(asc(eventRegistrations.createdAt));
  }

  async incrementEventRegisteredCount(eventId: string): Promise<boolean> {
    const result = await db
      .update(events)
      .set({ registeredCount: sql`${events.registeredCount} + 1` })
      .where(sql`${events.id} = ${eventId} AND ${events.registeredCount} < ${events.capacity}`)
      .returning({ id: events.id });
    
    return result.length > 0;
  }

  async decrementEventRegisteredCount(eventId: string): Promise<void> {
    await db
      .update(events)
      .set({ registeredCount: sql`${events.registeredCount} - 1` })
      .where(eq(events.id, eventId));
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(isNotNull(blogPosts.publishedAt))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.category, category))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getContactSubmissionsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactSubmissions);
    return Number(result[0]?.count || 0);
  }

  async getPartnerApplicationsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(partnerApplications);
    return Number(result[0]?.count || 0);
  }

  async getMentorApplicationsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(mentorApplications);
    return Number(result[0]?.count || 0);
  }

  async getVolunteerApplicationsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(volunteerApplications);
    return Number(result[0]?.count || 0);
  }

  async getAllEvents(): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .orderBy(desc(events.date));
  }

  async getEventsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(events);
    return Number(result[0]?.count || 0);
  }

  async updateEvent(id: string, data: Partial<InsertEvent>): Promise<Event | undefined> {
    const [event] = await db
      .update(events)
      .set(data)
      .where(eq(events.id, id))
      .returning();
    return event || undefined;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts);
    return Number(result[0]?.count || 0);
  }

  async updateBlogPost(id: string, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set(data)
      .where(eq(blogPosts.id, id))
      .returning();
    return post || undefined;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
}

export const storage = new DatabaseStorage();
