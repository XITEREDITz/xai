import { users, projects, templates, aiGenerations, adViews, type User, type InsertUser, type Project, type InsertProject, type Template, type AiGeneration, type AdView } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCoins(userId: string, coins: number): Promise<User>;
  updatePaypalSubscriptionId(userId: string, subscriptionId: string): Promise<User>;
  
  // Project methods
  getProject(id: string): Promise<Project | undefined>;
  getUserProjects(userId: string): Promise<Project[]>;
  createProject(project: InsertProject & { userId: string }): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // Template methods
  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  
  // AI Generation methods
  createAiGeneration(generation: Omit<AiGeneration, 'id' | 'createdAt'>): Promise<AiGeneration>;
  getUserGenerations(userId: string): Promise<AiGeneration[]>;
  
  // Ad Views methods
  createAdView(adView: Omit<AdView, 'id' | 'viewedAt'>): Promise<AdView>;
  getUserAdViews(userId: string): Promise<AdView[]>;
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7 days trial
    
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, trialEndsAt })
      .returning();
    return user;
  }

  async updateUserCoins(userId: string, coins: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ coins })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updatePaypalSubscriptionId(userId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ paypalSubscriptionId: subscriptionId })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt));
  }

  async createProject(project: InsertProject & { userId: string }): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getTemplates(): Promise<Template[]> {
    return await db.select().from(templates).orderBy(desc(templates.rating));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.category, category));
  }

  async createAiGeneration(generation: Omit<AiGeneration, 'id' | 'createdAt'>): Promise<AiGeneration> {
    const [newGeneration] = await db
      .insert(aiGenerations)
      .values(generation)
      .returning();
    return newGeneration;
  }

  async getUserGenerations(userId: string): Promise<AiGeneration[]> {
    return await db.select().from(aiGenerations).where(eq(aiGenerations.userId, userId)).orderBy(desc(aiGenerations.createdAt));
  }

  async createAdView(adView: Omit<AdView, 'id' | 'viewedAt'>): Promise<AdView> {
    const [newAdView] = await db
      .insert(adViews)
      .values(adView)
      .returning();
    return newAdView;
  }

  async getUserAdViews(userId: string): Promise<AdView[]> {
    return await db.select().from(adViews).where(eq(adViews.userId, userId)).orderBy(desc(adViews.viewedAt));
  }
}

export const storage = new DatabaseStorage();
