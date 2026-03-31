import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  users, 
  griStandards, 
  templates, 
  dataPoints, 
  reports, 
  activityLogs, 
  aiMessages,
  type User, 
  type InsertUser,
  type GriStandard, 
  type InsertGriStandard,
  type Template, 
  type InsertTemplate,
  type DataPoint, 
  type InsertDataPoint,
  type Report, 
  type InsertReport,
  type ActivityLog, 
  type InsertActivityLog,
  type AiMessage, 
  type InsertAiMessage
} from "@shared/schema";

import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // GRI Standards operations
  async getGriStandard(id: number): Promise<GriStandard | undefined> {
    const [standard] = await db.select().from(griStandards).where(eq(griStandards.id, id));
    return standard;
  }

  async getGriStandardByCode(code: string): Promise<GriStandard | undefined> {
    const [standard] = await db.select().from(griStandards).where(eq(griStandards.code, code));
    return standard;
  }

  async getAllGriStandards(): Promise<GriStandard[]> {
    return await db.select().from(griStandards);
  }

  async getGriStandardsByCategory(category: string): Promise<GriStandard[]> {
    return await db.select().from(griStandards).where(eq(griStandards.category, category));
  }

  async createGriStandard(insertGriStandard: InsertGriStandard): Promise<GriStandard> {
    const [standard] = await db.insert(griStandards).values(insertGriStandard).returning();
    return standard;
  }
  
  // Template operations
  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }

  async getTemplatesByUser(userId: number): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.userId, userId));
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await db.insert(templates).values(insertTemplate).returning();
    return template;
  }
  
  // Data Point operations
  async getDataPoint(id: number): Promise<DataPoint | undefined> {
    const [dataPoint] = await db.select().from(dataPoints).where(eq(dataPoints.id, id));
    return dataPoint;
  }

  async getDataPointsByTemplate(templateId: number): Promise<DataPoint[]> {
    return await db.select().from(dataPoints).where(eq(dataPoints.templateId, templateId));
  }

  async getDataPointsByStandard(standardId: number): Promise<DataPoint[]> {
    return await db.select().from(dataPoints).where(eq(dataPoints.standardId, standardId));
  }

  async getDataPointsByUser(userId: number): Promise<DataPoint[]> {
    return await db.select().from(dataPoints).where(eq(dataPoints.userId, userId));
  }

  async createDataPoint(insertDataPoint: InsertDataPoint): Promise<DataPoint> {
    const [dataPoint] = await db.insert(dataPoints).values(insertDataPoint).returning();
    return dataPoint;
  }

  async updateDataPoint(id: number, dataPointUpdate: Partial<DataPoint>): Promise<DataPoint | undefined> {
    const [updatedDataPoint] = await db
      .update(dataPoints)
      .set(dataPointUpdate)
      .where(eq(dataPoints.id, id))
      .returning();
    return updatedDataPoint;
  }
  
  // Report operations
  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async getAllReports(): Promise<Report[]> {
    return await db.select().from(reports);
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    return await db.select().from(reports).where(eq(reports.userId, userId));
  }

  async getReportsByTemplate(templateId: number): Promise<Report[]> {
    return await db.select().from(reports).where(eq(reports.templateId, templateId));
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db.insert(reports).values(insertReport).returning();
    return report;
  }
  
  // Activity Log operations
  async getActivityLog(id: number): Promise<ActivityLog | undefined> {
    const [log] = await db.select().from(activityLogs).where(eq(activityLogs.id, id));
    return log;
  }

  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs);
  }

  async getActivityLogsByUser(userId: number): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).where(eq(activityLogs.userId, userId));
  }

  async getRecentActivityLogs(limit: number): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).limit(limit);
  }

  async createActivityLog(insertActivityLog: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db.insert(activityLogs).values(insertActivityLog).returning();
    return log;
  }
  
  // AI Message operations
  async getAiMessage(id: number): Promise<AiMessage | undefined> {
    const [message] = await db.select().from(aiMessages).where(eq(aiMessages.id, id));
    return message;
  }

  async getAiMessagesByUser(userId: number): Promise<AiMessage[]> {
    return await db.select().from(aiMessages).where(eq(aiMessages.userId, userId));
  }

  async createAiMessage(insertAiMessage: InsertAiMessage): Promise<AiMessage> {
    const [message] = await db.insert(aiMessages).values(insertAiMessage).returning();
    return message;
  }
}