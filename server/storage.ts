import {
  users,
  contactSubmissions,
  events,
  eventRegistrations,
  blogPosts,
  partnerApplications,
  mentorApplications,
  volunteerApplications,
  students,
  mentorMatches,
  activityLogs,
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
  type InsertVolunteerApplication,
  type Student,
  type InsertStudent,
  type MentorMatch,
  type InsertMentorMatch,
  type ActivityLog,
  type MediaFile,
  media
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, sql, and, lt, asc, isNotNull } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<User | undefined>;
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
  createStudent(student: InsertStudent): Promise<Student>;
  getStudents(): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<void>;
  getStudentsCount(): Promise<number>;
  createMentorMatch(match: InsertMentorMatch): Promise<MentorMatch>;
  getMentorMatches(): Promise<MentorMatch[]>;
  getMentorMatch(id: string): Promise<MentorMatch | undefined>;
  getMentorMatchesByMentor(mentorId: string): Promise<MentorMatch[]>;
  getMentorMatchesByStudent(studentId: string): Promise<MentorMatch[]>;
  updateMentorMatch(id: string, data: Partial<InsertMentorMatch>): Promise<MentorMatch | undefined>;
  deleteMentorMatch(id: string): Promise<void>;
  getMentorMatchesCount(): Promise<number>;
  getDailySubmissionCounts(days: number, startDate?: Date, endDate?: Date): Promise<{ date: string; count: number }[]>;
  bulkDeletePartnerApplications(ids: string[]): Promise<void>;
  bulkDeleteMentorApplications(ids: string[]): Promise<void>;
  bulkDeleteVolunteerApplications(ids: string[]): Promise<void>;
  bulkDeleteContactSubmissions(ids: string[]): Promise<void>;
  createActivityLog(log: Omit<ActivityLog, "id" | "createdAt">): Promise<ActivityLog>;
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
  getRecentSubmissionCounts(hours?: number): Promise<{
    partners: number;
    mentors: number;
    volunteers: number;
    contacts: number;
    total: number;
  }>;
  getComparisonMetrics(): Promise<{
    current: {
      partners: number;
      mentors: number;
      volunteers: number;
      contacts: number;
    };
    previous: {
      partners: number;
      mentors: number;
      volunteers: number;
      contacts: number;
    };
    changes: {
      partners: number;
      mentors: number;
      volunteers: number;
      contacts: number;
    };
  }>;
  createMedia(file: Omit<MediaFile, "id" | "createdAt">): Promise<MediaFile>;
  getMediaFiles(): Promise<MediaFile[]>;
  deleteMedia(id: string): Promise<void>;
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

  async updateUserPassword(userId: string, hashedPassword: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
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

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db
      .insert(students)
      .values(insertStudent)
      .returning();
    return student;
  }

  async getStudents(): Promise<Student[]> {
    return await db
      .select()
      .from(students)
      .orderBy(desc(students.createdAt));
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, id));
    return student || undefined;
  }

  async updateStudent(id: string, data: Partial<InsertStudent>): Promise<Student | undefined> {
    const [student] = await db
      .update(students)
      .set(data)
      .where(eq(students.id, id))
      .returning();
    return student || undefined;
  }

  async deleteStudent(id: string): Promise<void> {
    await db.delete(students).where(eq(students.id, id));
  }

  async getStudentsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(students);
    return Number(result[0]?.count || 0);
  }

  async createMentorMatch(insertMatch: InsertMentorMatch): Promise<MentorMatch> {
    const [match] = await db
      .insert(mentorMatches)
      .values(insertMatch)
      .returning();
    return match;
  }

  async getMentorMatches(): Promise<MentorMatch[]> {
    return await db
      .select()
      .from(mentorMatches)
      .orderBy(desc(mentorMatches.createdAt));
  }

  async getMentorMatch(id: string): Promise<MentorMatch | undefined> {
    const [match] = await db
      .select()
      .from(mentorMatches)
      .where(eq(mentorMatches.id, id));
    return match || undefined;
  }

  async getMentorMatchesByMentor(mentorId: string): Promise<MentorMatch[]> {
    return await db
      .select()
      .from(mentorMatches)
      .where(eq(mentorMatches.mentorId, mentorId))
      .orderBy(desc(mentorMatches.createdAt));
  }

  async getMentorMatchesByStudent(studentId: string): Promise<MentorMatch[]> {
    return await db
      .select()
      .from(mentorMatches)
      .where(eq(mentorMatches.studentId, studentId))
      .orderBy(desc(mentorMatches.createdAt));
  }

  async updateMentorMatch(id: string, data: Partial<InsertMentorMatch>): Promise<MentorMatch | undefined> {
    const [match] = await db
      .update(mentorMatches)
      .set(data)
      .where(eq(mentorMatches.id, id))
      .returning();
    return match || undefined;
  }

  async deleteMentorMatch(id: string): Promise<void> {
    await db.delete(mentorMatches).where(eq(mentorMatches.id, id));
  }


  async getMentorMatchesCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(mentorMatches);
    return Number(result[0]?.count || 0);
  }

  async getDailySubmissionCounts(days: number, startDate?: Date, endDate?: Date): Promise<{ date: string; count: number }[]> {
    let start = new Date();
    let end = new Date();

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      // Ensure start is at 00:00:00 and end is at 23:59:59
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else {
      start.setDate(start.getDate() - days);
      start.setHours(0, 0, 0, 0);
    }

    const partners = await db
      .select({ createdAt: partnerApplications.createdAt })
      .from(partnerApplications)
      .where(and(
        gte(partnerApplications.createdAt, start),
        lt(partnerApplications.createdAt, end)
      ));

    const mentors = await db
      .select({ createdAt: mentorApplications.createdAt })
      .from(mentorApplications)
      .where(and(
        gte(mentorApplications.createdAt, start),
        lt(mentorApplications.createdAt, end)
      ));

    const volunteers = await db
      .select({ createdAt: volunteerApplications.createdAt })
      .from(volunteerApplications)
      .where(and(
        gte(volunteerApplications.createdAt, start),
        lt(volunteerApplications.createdAt, end)
      ));

    const contacts = await db
      .select({ createdAt: contactSubmissions.createdAt })
      .from(contactSubmissions)
      .where(and(
        gte(contactSubmissions.createdAt, start),
        lt(contactSubmissions.createdAt, end)
      ));

    const allDates = [
      ...partners.map(p => p.createdAt),
      ...mentors.map(m => m.createdAt),
      ...volunteers.map(v => v.createdAt),
      ...contacts.map(c => c.createdAt)
    ];

    const counts: Record<string, number> = {};

    // Initialize days in range
    const current = new Date(start);
    while (current <= end) {
      const key = current.toISOString().split('T')[0];
      counts[key] = 0;
      current.setDate(current.getDate() + 1);
    }

    allDates.forEach(date => {
      const key = new Date(date).toISOString().split('T')[0];
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    });

    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async bulkDeletePartnerApplications(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await db.delete(partnerApplications).where(sql`${partnerApplications.id} IN ${ids}`);
  }

  async bulkDeleteMentorApplications(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await db.delete(mentorApplications).where(sql`${mentorApplications.id} IN ${ids}`);
  }

  async bulkDeleteVolunteerApplications(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await db.delete(volunteerApplications).where(sql`${volunteerApplications.id} IN ${ids}`);
  }

  async bulkDeleteContactSubmissions(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    await db.delete(contactSubmissions).where(sql`${contactSubmissions.id} IN ${ids}`);
  }

  async createActivityLog(log: Omit<ActivityLog, "id" | "createdAt">): Promise<ActivityLog> {
    const [newLog] = await db.insert(activityLogs).values(log).returning();
    return newLog;
  }

  async getActivityLogs(limit = 50): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
  }

  async getRecentSubmissionCounts(hours = 24): Promise<{
    partners: number;
    mentors: number;
    volunteers: number;
    contacts: number;
    total: number;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);

    const [partnersResult, mentorsResult, volunteersResult, contactsResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(partnerApplications)
        .where(gte(partnerApplications.createdAt, cutoffDate)),
      db.select({ count: sql<number>`count(*)` })
        .from(mentorApplications)
        .where(gte(mentorApplications.createdAt, cutoffDate)),
      db.select({ count: sql<number>`count(*)` })
        .from(volunteerApplications)
        .where(gte(volunteerApplications.createdAt, cutoffDate)),
      db.select({ count: sql<number>`count(*)` })
        .from(contactSubmissions)
        .where(gte(contactSubmissions.createdAt, cutoffDate))
    ]);

    const partners = Number(partnersResult[0]?.count || 0);
    const mentors = Number(mentorsResult[0]?.count || 0);
    const volunteers = Number(volunteersResult[0]?.count || 0);
    const contacts = Number(contactsResult[0]?.count || 0);

    return {
      partners,
      mentors,
      volunteers,
      contacts,
      total: partners + mentors + volunteers + contacts
    };
  }

  async getComparisonMetrics(): Promise<{
    current: {
      partners: number;
      mentors: number;
      volunteers: number;
      contacts: number;
    };
    previous: {
      partners: number;
      mentors: number;
      volunteers: number;
      contacts: number;
    };
    changes: {
      partners: number;
      mentors: number;
      volunteers: number;
      contacts: number;
    };
  }> {
    // Get current month's data (last 30 days)
    const currentPeriodStart = new Date();
    currentPeriodStart.setDate(currentPeriodStart.getDate() - 30);

    // Get previous month's data (31-60 days ago)
    const previousPeriodStart = new Date();
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 60);
    const previousPeriodEnd = new Date();
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 30);

    const [
      currentPartnersResult,
      currentMentorsResult,
      currentVolunteersResult,
      currentContactsResult,
      previousPartnersResult,
      previousMentorsResult,
      previousVolunteersResult,
      previousContactsResult
    ] = await Promise.all([
      // Current period
      db.select({ count: sql<number>`count(*)` })
        .from(partnerApplications)
        .where(gte(partnerApplications.createdAt, currentPeriodStart)),
      db.select({ count: sql<number>`count(*)` })
        .from(mentorApplications)
        .where(gte(mentorApplications.createdAt, currentPeriodStart)),
      db.select({ count: sql<number>`count(*)` })
        .from(volunteerApplications)
        .where(gte(volunteerApplications.createdAt, currentPeriodStart)),
      db.select({ count: sql<number>`count(*)` })
        .from(contactSubmissions)
        .where(gte(contactSubmissions.createdAt, currentPeriodStart)),
      // Previous period
      db.select({ count: sql<number>`count(*)` })
        .from(partnerApplications)
        .where(and(
          gte(partnerApplications.createdAt, previousPeriodStart),
          lt(partnerApplications.createdAt, previousPeriodEnd)
        )),
      db.select({ count: sql<number>`count(*)` })
        .from(mentorApplications)
        .where(and(
          gte(mentorApplications.createdAt, previousPeriodStart),
          lt(mentorApplications.createdAt, previousPeriodEnd)
        )),
      db.select({ count: sql<number>`count(*)` })
        .from(volunteerApplications)
        .where(and(
          gte(volunteerApplications.createdAt, previousPeriodStart),
          lt(volunteerApplications.createdAt, previousPeriodEnd)
        )),
      db.select({ count: sql<number>`count(*)` })
        .from(contactSubmissions)
        .where(and(
          gte(contactSubmissions.createdAt, previousPeriodStart),
          lt(contactSubmissions.createdAt, previousPeriodEnd)
        ))
    ]);

    const current = {
      partners: Number(currentPartnersResult[0]?.count || 0),
      mentors: Number(currentMentorsResult[0]?.count || 0),
      volunteers: Number(currentVolunteersResult[0]?.count || 0),
      contacts: Number(currentContactsResult[0]?.count || 0)
    };

    const previous = {
      partners: Number(previousPartnersResult[0]?.count || 0),
      mentors: Number(previousMentorsResult[0]?.count || 0),
      volunteers: Number(previousVolunteersResult[0]?.count || 0),
      contacts: Number(previousContactsResult[0]?.count || 0)
    };

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const changes = {
      partners: calculateChange(current.partners, previous.partners),
      mentors: calculateChange(current.mentors, previous.mentors),
      volunteers: calculateChange(current.volunteers, previous.volunteers),
      contacts: calculateChange(current.contacts, previous.contacts)
    };

    return { current, previous, changes };
  }

  async createMedia(file: Omit<MediaFile, "id" | "createdAt">): Promise<MediaFile> {
    const [newFile] = await db.insert(media).values(file).returning();
    return newFile;
  }

  async getMediaFiles(): Promise<MediaFile[]> {
    return await db.select().from(media).orderBy(desc(media.createdAt));
  }

  async deleteMedia(id: string): Promise<void> {
    await db.delete(media).where(eq(media.id, id));
  }
}

export const storage = new DatabaseStorage();
