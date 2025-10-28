import { users, contactSubmissions, events, type User, type InsertUser, type Contact, type InsertContact, type Event, type InsertEvent } from "@shared/schema";
import { db } from "./db";
import { eq, gte, sql, asc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(contact: InsertContact): Promise<Contact>;
  getContactSubmissions(): Promise<Contact[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  getUpcomingEvents(): Promise<Event[]>;
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
}

export const storage = new DatabaseStorage();
