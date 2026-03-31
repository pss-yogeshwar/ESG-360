// Import DatabaseStorage implementation
import { DatabaseStorage } from "./dbStorage";

import { 
  users, type User, type InsertUser,
  griStandards, type GriStandard, type InsertGriStandard,
  templates, type Template, type InsertTemplate,
  dataPoints, type DataPoint, type InsertDataPoint,
  reports, type Report, type InsertReport,
  activityLogs, type ActivityLog, type InsertActivityLog,
  aiMessages, type AiMessage, type InsertAiMessage
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  // GRI Standards operations
  getGriStandard(id: number): Promise<GriStandard | undefined>;
  getGriStandardByCode(code: string): Promise<GriStandard | undefined>;
  getAllGriStandards(): Promise<GriStandard[]>;
  getGriStandardsByCategory(category: string): Promise<GriStandard[]>;
  createGriStandard(griStandard: InsertGriStandard): Promise<GriStandard>;
  
  // Template operations
  getTemplate(id: number): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  getTemplatesByUser(userId: number): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Data Point operations
  getDataPoint(id: number): Promise<DataPoint | undefined>;
  getDataPointsByTemplate(templateId: number): Promise<DataPoint[]>;
  getDataPointsByStandard(standardId: number): Promise<DataPoint[]>;
  getDataPointsByUser(userId: number): Promise<DataPoint[]>;
  createDataPoint(dataPoint: InsertDataPoint): Promise<DataPoint>;
  updateDataPoint(id: number, dataPoint: Partial<DataPoint>): Promise<DataPoint | undefined>;
  
  // Report operations
  getReport(id: number): Promise<Report | undefined>;
  getAllReports(): Promise<Report[]>;
  getReportsByUser(userId: number): Promise<Report[]>;
  getReportsByTemplate(templateId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  
  // Activity Log operations
  getActivityLog(id: number): Promise<ActivityLog | undefined>;
  getAllActivityLogs(): Promise<ActivityLog[]>;
  getActivityLogsByUser(userId: number): Promise<ActivityLog[]>;
  getRecentActivityLogs(limit: number): Promise<ActivityLog[]>;
  createActivityLog(activityLog: InsertActivityLog): Promise<ActivityLog>;
  
  // AI Message operations
  getAiMessage(id: number): Promise<AiMessage | undefined>;
  getAiMessagesByUser(userId: number): Promise<AiMessage[]>;
  createAiMessage(aiMessage: InsertAiMessage): Promise<AiMessage>;
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private griStandards: Map<number, GriStandard>;
  private templates: Map<number, Template>;
  private dataPoints: Map<number, DataPoint>;
  private reports: Map<number, Report>;
  private activityLogs: Map<number, ActivityLog>;
  private aiMessages: Map<number, AiMessage>;
  
  private currentUserId: number;
  private currentGriStandardId: number;
  private currentTemplateId: number;
  private currentDataPointId: number;
  private currentReportId: number;
  private currentActivityLogId: number;
  private currentAiMessageId: number;
  
  constructor() {
    this.users = new Map();
    this.griStandards = new Map();
    this.templates = new Map();
    this.dataPoints = new Map();
    this.reports = new Map();
    this.activityLogs = new Map();
    this.aiMessages = new Map();
    
    this.currentUserId = 1;
    this.currentGriStandardId = 1;
    this.currentTemplateId = 1;
    this.currentDataPointId = 1;
    this.currentReportId = 1;
    this.currentActivityLogId = 1;
    this.currentAiMessageId = 1;

    // Initialize with default GRI standards
    this.initializeGriStandards();
    
    // Initialize with a demo user
    this.createUser({
      username: "demo",
      password: "demo123",
      fullName: "John Smith",
      role: "admin"
    });
  }

  // Initialize default GRI standards
  private initializeGriStandards() {
    const defaultStandards: InsertGriStandard[] = [
      {
        code: "GRI 301",
        name: "Materials",
        category: "environmental",
        description: "The Materials standard addresses an organization's impacts related to materials, including both virgin and recycled materials used."
      },
      {
        code: "GRI 302",
        name: "Energy",
        category: "environmental",
        description: "The Energy standard addresses an organization's energy consumption and energy efficiency."
      },
      {
        code: "GRI 303",
        name: "Water and Effluents",
        category: "environmental",
        description: "The Water and Effluents standard addresses impacts related to water consumption and discharge."
      },
      {
        code: "GRI 304",
        name: "Biodiversity",
        category: "environmental",
        description: "The Biodiversity standard addresses impacts on ecosystems and biodiversity."
      },
      {
        code: "GRI 305",
        name: "Emissions",
        category: "environmental",
        description: "The Emissions standard addresses an organization's greenhouse gas (GHG) emissions and other significant air emissions."
      },
      {
        code: "GRI 401",
        name: "Employment",
        category: "social",
        description: "The Employment standard addresses an organization's approach to employment, including recruitment, retention, working conditions, and benefits."
      },
      {
        code: "GRI 403",
        name: "Occupational Health and Safety",
        category: "social",
        description: "The Occupational Health and Safety standard addresses an organization's approach to preventing harm and promoting health and well-being at work."
      },
      {
        code: "GRI 405",
        name: "Diversity and Equal Opportunity",
        category: "social",
        description: "The Diversity and Equal Opportunity standard addresses an organization's approach to ensuring diversity and equal opportunity in recruitment and promotions."
      },
      {
        code: "GRI 413",
        name: "Local Communities",
        category: "social",
        description: "The Local Communities standard addresses an organization's impacts on local communities."
      },
      {
        code: "GRI 205",
        name: "Anti-corruption",
        category: "governance",
        description: "The Anti-corruption standard addresses an organization's approach to preventing and mitigating corruption."
      },
      {
        code: "GRI 206",
        name: "Anti-competitive Behavior",
        category: "governance",
        description: "The Anti-competitive Behavior standard addresses an organization's approach to preventing anti-competitive practices."
      },
      {
        code: "GRI 207",
        name: "Tax",
        category: "governance",
        description: "The Tax standard addresses an organization's approach to tax strategy and transparency."
      }
    ];

    defaultStandards.forEach(standard => {
      this.createGriStandard(standard);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // GRI Standards operations
  async getGriStandard(id: number): Promise<GriStandard | undefined> {
    return this.griStandards.get(id);
  }
  
  async getGriStandardByCode(code: string): Promise<GriStandard | undefined> {
    return Array.from(this.griStandards.values()).find(
      (standard) => standard.code === code,
    );
  }
  
  async getAllGriStandards(): Promise<GriStandard[]> {
    return Array.from(this.griStandards.values());
  }
  
  async getGriStandardsByCategory(category: string): Promise<GriStandard[]> {
    return Array.from(this.griStandards.values()).filter(
      (standard) => standard.category === category,
    );
  }
  
  async createGriStandard(insertGriStandard: InsertGriStandard): Promise<GriStandard> {
    const id = this.currentGriStandardId++;
    const griStandard: GriStandard = { ...insertGriStandard, id };
    this.griStandards.set(id, griStandard);
    return griStandard;
  }
  
  // Template operations
  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }
  
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }
  
  async getTemplatesByUser(userId: number): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.userId === userId,
    );
  }
  
  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const template: Template = { 
      ...insertTemplate, 
      id, 
      createdAt: new Date() 
    };
    this.templates.set(id, template);
    return template;
  }
  
  // Data Point operations
  async getDataPoint(id: number): Promise<DataPoint | undefined> {
    return this.dataPoints.get(id);
  }
  
  async getDataPointsByTemplate(templateId: number): Promise<DataPoint[]> {
    return Array.from(this.dataPoints.values()).filter(
      (dataPoint) => dataPoint.templateId === templateId,
    );
  }
  
  async getDataPointsByStandard(standardId: number): Promise<DataPoint[]> {
    return Array.from(this.dataPoints.values()).filter(
      (dataPoint) => dataPoint.standardId === standardId,
    );
  }
  
  async getDataPointsByUser(userId: number): Promise<DataPoint[]> {
    return Array.from(this.dataPoints.values()).filter(
      (dataPoint) => dataPoint.userId === userId,
    );
  }
  
  async createDataPoint(insertDataPoint: InsertDataPoint): Promise<DataPoint> {
    const id = this.currentDataPointId++;
    const dataPoint: DataPoint = { 
      ...insertDataPoint, 
      id, 
      createdAt: new Date() 
    };
    this.dataPoints.set(id, dataPoint);
    return dataPoint;
  }
  
  async updateDataPoint(id: number, dataPointUpdate: Partial<DataPoint>): Promise<DataPoint | undefined> {
    const dataPoint = this.dataPoints.get(id);
    if (!dataPoint) return undefined;
    
    const updatedDataPoint = { ...dataPoint, ...dataPointUpdate };
    this.dataPoints.set(id, updatedDataPoint);
    return updatedDataPoint;
  }
  
  // Report operations
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }
  
  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }
  
  async getReportsByUser(userId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.userId === userId,
    );
  }
  
  async getReportsByTemplate(templateId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.templateId === templateId,
    );
  }
  
  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const report: Report = { 
      ...insertReport, 
      id, 
      createdAt: new Date() 
    };
    this.reports.set(id, report);
    return report;
  }
  
  // Activity Log operations
  async getActivityLog(id: number): Promise<ActivityLog | undefined> {
    return this.activityLogs.get(id);
  }
  
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values());
  }
  
  async getActivityLogsByUser(userId: number): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values()).filter(
      (log) => log.userId === userId,
    );
  }
  
  async getRecentActivityLogs(limit: number): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  async createActivityLog(insertActivityLog: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentActivityLogId++;
    const activityLog: ActivityLog = { 
      ...insertActivityLog, 
      id, 
      timestamp: new Date() 
    };
    this.activityLogs.set(id, activityLog);
    return activityLog;
  }
  
  // AI Message operations
  async getAiMessage(id: number): Promise<AiMessage | undefined> {
    return this.aiMessages.get(id);
  }
  
  async getAiMessagesByUser(userId: number): Promise<AiMessage[]> {
    return Array.from(this.aiMessages.values()).filter(
      (message) => message.userId === userId,
    );
  }
  
  async createAiMessage(insertAiMessage: InsertAiMessage): Promise<AiMessage> {
    const id = this.currentAiMessageId++;
    const aiMessage: AiMessage = { 
      ...insertAiMessage, 
      id, 
      timestamp: new Date() 
    };
    this.aiMessages.set(id, aiMessage);
    return aiMessage;
  }
}

// Use the database storage 
export const storage = new DatabaseStorage();