import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { 
  insertUserSchema, 
  insertGriStandardSchema, 
  insertTemplateSchema, 
  insertDataPointSchema, 
  insertReportSchema, 
  insertActivityLogSchema, 
  insertAiMessageSchema
} from "@shared/schema";
import OpenAI from "openai";
import { setupAuth } from "./auth";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "demo-key",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API routes
  const apiRouter = express.Router();
  
  // User routes
  apiRouter.post("/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  apiRouter.get("/users", async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  apiRouter.get("/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  // GRI Standards routes
  apiRouter.get("/gri-standards", async (req, res) => {
    const category = req.query.category as string | undefined;
    let standards;
    
    if (category) {
      standards = await storage.getGriStandardsByCategory(category);
    } else {
      standards = await storage.getAllGriStandards();
    }
    
    res.json(standards);
  });

  apiRouter.get("/gri-standards/:id", async (req, res) => {
    const standardId = parseInt(req.params.id, 10);
    const standard = await storage.getGriStandard(standardId);
    if (!standard) {
      return res.status(404).json({ message: "GRI Standard not found" });
    }
    res.json(standard);
  });

  apiRouter.post("/gri-standards", async (req, res) => {
    try {
      const standardData = insertGriStandardSchema.parse(req.body);
      const standard = await storage.createGriStandard(standardData);
      res.json(standard);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create GRI Standard" });
      }
    }
  });

  // Template routes
  apiRouter.get("/templates", async (_req, res) => {
    const templates = await storage.getAllTemplates();
    res.json(templates);
  });

  apiRouter.get("/templates/user/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const templates = await storage.getTemplatesByUser(userId);
    res.json(templates);
  });

  apiRouter.get("/templates/:id", async (req, res) => {
    const templateId = parseInt(req.params.id, 10);
    const template = await storage.getTemplate(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.json(template);
  });

  apiRouter.post("/templates", async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(templateData);
      
      // Log the activity
      await storage.createActivityLog({
        activity: "Template Created",
        description: `Template "${template.name}" created`,
        userId: template.userId,
        status: "completed"
      });
      
      res.json(template);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create template" });
      }
    }
  });

  // Data Point routes
  apiRouter.get("/data-points/template/:templateId", async (req, res) => {
    const templateId = parseInt(req.params.templateId, 10);
    const dataPoints = await storage.getDataPointsByTemplate(templateId);
    res.json(dataPoints);
  });

  apiRouter.post("/data-points", async (req, res) => {
    try {
      const dataPointData = insertDataPointSchema.parse(req.body);
      const dataPoint = await storage.createDataPoint(dataPointData);
      
      // Check for anomalies (simple check for demo purposes)
      const value = parseFloat(dataPoint.value);
      if (!isNaN(value) && (value < 0 || value > 10000)) {
        await storage.updateDataPoint(dataPoint.id, { isAnomaly: true });
        
        // Log the anomaly
        await storage.createActivityLog({
          activity: "Anomaly Detected",
          description: `Anomaly detected in data for template ID ${dataPoint.templateId}`,
          userId: dataPoint.userId,
          status: "needs_review"
        });
      }
      
      res.json(dataPoint);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create data point" });
      }
    }
  });

  apiRouter.put("/data-points/:id", async (req, res) => {
    const dataPointId = parseInt(req.params.id, 10);
    try {
      const dataPointUpdate = req.body;
      const updatedDataPoint = await storage.updateDataPoint(dataPointId, dataPointUpdate);
      if (!updatedDataPoint) {
        return res.status(404).json({ message: "Data point not found" });
      }
      res.json(updatedDataPoint);
    } catch (error) {
      res.status(500).json({ message: "Failed to update data point" });
    }
  });

  // Reports routes
  apiRouter.get("/reports", async (_req, res) => {
    const reports = await storage.getAllReports();
    res.json(reports);
  });

  apiRouter.get("/reports/user/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const reports = await storage.getReportsByUser(userId);
    res.json(reports);
  });

  apiRouter.post("/reports", async (req, res) => {
    try {
      const reportData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(reportData);
      
      // Log the activity
      await storage.createActivityLog({
        activity: "Report Generated",
        description: `Report "${report.name}" generated`,
        userId: report.userId,
        status: "completed"
      });
      
      res.json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create report" });
      }
    }
  });

  // Activity Log routes
  apiRouter.get("/activity-logs/recent", async (req, res) => {
    const limit = parseInt(req.query.limit as string || "10", 10);
    const logs = await storage.getRecentActivityLogs(limit);
    res.json(logs);
  });

  apiRouter.get("/activity-logs/user/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const logs = await storage.getActivityLogsByUser(userId);
    res.json(logs);
  });

  // AI Assistant routes
  apiRouter.post("/ai-assistant/query", async (req, res) => {
    try {
      const { userId, query } = req.body;
      
      if (!userId || !query) {
        return res.status(400).json({ message: "User ID and query are required" });
      }
      
      let response = "";
      
      try {
        // Call OpenAI for the response
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const openaiResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an ESG data assistant. Provide concise, helpful answers about ESG data, GRI standards, and sustainability practices. Keep answers brief and to the point."
            },
            {
              role: "user",
              content: query
            }
          ],
          max_tokens: 150
        });
        
        response = openaiResponse.choices[0].message.content || "I'm sorry, I couldn't process that request.";
      } catch (error) {
        console.error("OpenAI API error:", error);
        response = "I'm sorry, I encountered an error while processing your request. Please try again later.";
      }
      
      // Save the conversation
      const aiMessage = await storage.createAiMessage({
        userId,
        query,
        response
      });
      
      res.json({ message: aiMessage });
    } catch (error) {
      res.status(500).json({ message: "Failed to process AI assistant query" });
    }
  });

  apiRouter.get("/ai-assistant/history/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const messages = await storage.getAiMessagesByUser(userId);
    res.json(messages);
  });

  // Data Ingestion routes (simulated)
  apiRouter.post("/data-ingestion/microsoft", async (req, res) => {
    try {
      const { userId, templateId, description } = req.body;
      
      if (!userId || !templateId) {
        return res.status(400).json({ message: "User ID and template ID are required" });
      }
      
      // Simulate the ingestion process
      // In a real app, this would connect to Microsoft Sustainability Manager API
      
      // Log the activity
      await storage.createActivityLog({
        activity: "Data Ingestion",
        description: description || "Data ingested to Microsoft Sustainability Manager",
        userId,
        status: "completed"
      });
      
      res.json({ success: true, message: "Data ingestion simulated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to simulate data ingestion" });
    }
  });

  // Register the API routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
