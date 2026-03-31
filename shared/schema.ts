import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

// GRI Standards schema
export const griStandards = pgTable("gri_standards", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(), // environmental, social, governance
  description: text("description").notNull(),
});

export const insertGriStandardSchema = createInsertSchema(griStandards).pick({
  code: true,
  name: true,
  category: true,
  description: true,
});

// Templates schema
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").notNull(), // Foreign key to users
  createdAt: timestamp("created_at").notNull().defaultNow(),
  standards: jsonb("standards").notNull(), // Array of GRI standard IDs
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  name: true,
  description: true,
  userId: true,
  standards: true,
});

// Data Points schema
export const dataPoints = pgTable("data_points", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(), // Foreign key to templates
  standardId: integer("standard_id").notNull(), // Foreign key to gri_standards
  value: text("value").notNull(),
  unit: text("unit"),
  period: text("period").notNull(), // e.g., "Q2 2023"
  isAnomaly: boolean("is_anomaly").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: integer("user_id").notNull(), // Foreign key to users
});

export const insertDataPointSchema = createInsertSchema(dataPoints).pick({
  templateId: true,
  standardId: true,
  value: true,
  unit: true,
  period: true,
  isAnomaly: true,
  notes: true,
  userId: true,
});

// Reports schema
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  templateId: integer("template_id").notNull(), // Foreign key to templates
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: integer("user_id").notNull(), // Foreign key to users
  reportData: jsonb("report_data").notNull(), // Contains the actual report data
});

export const insertReportSchema = createInsertSchema(reports).pick({
  name: true,
  description: true,
  templateId: true,
  userId: true,
  reportData: true,
});

// Activity Log schema
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  activity: text("activity").notNull(),
  description: text("description"),
  userId: integer("user_id"), // Foreign key to users, nullable for system activities
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  status: text("status").notNull(), // "completed", "pending", "failed", "needs_review"
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  activity: true,
  description: true,
  userId: true,
  status: true,
});

// AI Assistant Messages schema
export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Foreign key to users
  query: text("query").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertAiMessageSchema = createInsertSchema(aiMessages).pick({
  userId: true,
  query: true,
  response: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type GriStandard = typeof griStandards.$inferSelect;
export type InsertGriStandard = z.infer<typeof insertGriStandardSchema>;

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type DataPoint = typeof dataPoints.$inferSelect;
export type InsertDataPoint = z.infer<typeof insertDataPointSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type AiMessage = typeof aiMessages.$inferSelect;
export type InsertAiMessage = z.infer<typeof insertAiMessageSchema>;
