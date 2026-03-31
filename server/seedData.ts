import { db } from "./db";
import {
  users,
  griStandards,
  templates,
  reports,
  dataPoints,
  activityLogs,
  aiMessages,
  type InsertUser,
  type InsertTemplate,
  type InsertReport,
  type InsertDataPoint,
  type InsertActivityLog
} from "@shared/schema";

export async function seedDatabase() {
  console.log("Seeding database with sample data...");
  
  try {
    // 1. Create demo user if it doesn't exist
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      // Create demo user
      const [demoUser] = await db.insert(users).values({
        username: "demo",
        password: "demo123",
        fullName: "John Smith",
        role: "admin"
      }).returning();
      
      console.log("Created demo user:", demoUser.id);
      
      // 2. Create GRI standards (these should already exist from MemStorage)
      const existingStandards = await db.select().from(griStandards);
      
      if (existingStandards.length === 0) {
        console.log("No GRI standards found in database. Please ensure standards are seeded.");
      }
      
      // 3. Create sample templates
      const existingTemplates = await db.select().from(templates);
      
      if (existingTemplates.length === 0) {
        const templateData = [
          {
            name: "Annual Environmental Performance Template",
            description: "Template for tracking annual environmental metrics",
            userId: demoUser.id,
            standards: [1, 2, 3, 4, 5] // IDs of environmental standards
          },
          {
            name: "ESG Comprehensive Reporting Template",
            description: "Complete template covering environmental, social and governance metrics",
            userId: demoUser.id,
            standards: [1, 2, 3, 6, 7, 8, 10, 11, 12] // Mix of standards
          },
          {
            name: "Carbon Emissions Template",
            description: "Focused template for tracking greenhouse gas emissions",
            userId: demoUser.id,
            standards: [5] // Just emissions standard
          }
        ];
        
        for (const template of templateData) {
          const [createdTemplate] = await db.insert(templates).values(template).returning();
          console.log("Created template:", createdTemplate.id);
        }
      }
      
      // 4. Create sample reports
      const existingReports = await db.select().from(reports);
      
      if (existingReports.length === 0) {
        const allTemplates = await db.select().from(templates);
        
        if (allTemplates.length > 0) {
          const reportData = [
            {
              name: "2023 Annual Environmental Report",
              description: "Complete environmental performance analysis for 2023",
              userId: demoUser.id,
              templateId: allTemplates[0].id,
              reportData: {
                overview: {
                  environmentalScore: 72,
                  socialScore: 68,
                  governanceScore: 85
                },
                environmental: {
                  carbonEmissions: {
                    current: 1250,
                    previous: 1520,
                    unit: "tons CO2e",
                    change: -17.8
                  },
                  energyConsumption: {
                    current: 45280,
                    previous: 48900,
                    unit: "MWh",
                    change: -7.4
                  },
                  waterUsage: {
                    current: 186500,
                    previous: 195000,
                    unit: "m³",
                    change: -4.4
                  },
                  wasteGenerated: {
                    current: 874,
                    previous: 926,
                    unit: "tons",
                    change: -5.6
                  }
                }
              }
            },
            {
              name: "Q3 2023 ESG Performance Report",
              description: "Quarterly ESG metrics for Q3 2023",
              userId: demoUser.id,
              templateId: allTemplates[1].id,
              reportData: {
                overview: {
                  environmentalScore: 69,
                  socialScore: 74,
                  governanceScore: 82
                },
                environmental: {
                  carbonEmissions: {
                    current: 310,
                    previous: 345,
                    unit: "tons CO2e",
                    change: -10.1
                  },
                  energyConsumption: {
                    current: 11750,
                    previous: 12800,
                    unit: "MWh",
                    change: -8.2
                  }
                },
                social: {
                  employeeTraining: {
                    current: 4850,
                    previous: 3240,
                    unit: "hours",
                    change: 49.7
                  },
                  workplaceIncidents: {
                    current: 3,
                    previous: 6,
                    unit: "incidents",
                    change: -50.0
                  },
                  diversityScore: {
                    current: 74,
                    previous: 68,
                    unit: "score",
                    change: 8.8
                  }
                },
                governance: {
                  boardDiversity: {
                    current: 42,
                    previous: 35,
                    unit: "%",
                    change: 20.0
                  },
                  ethicsTraining: {
                    current: 98,
                    previous: 92,
                    unit: "% completed",
                    change: 6.5
                  }
                }
              }
            },
            {
              name: "2023 Carbon Footprint Analysis",
              description: "Detailed analysis of carbon emissions across operations",
              userId: demoUser.id,
              templateId: allTemplates[2].id,
              reportData: {
                overview: {
                  environmentalScore: 76,
                  socialScore: 0,
                  governanceScore: 0
                },
                emissions: {
                  scope1: {
                    current: 480,
                    previous: 520,
                    unit: "tons CO2e",
                    change: -7.7
                  },
                  scope2: {
                    current: 720,
                    previous: 840,
                    unit: "tons CO2e",
                    change: -14.3
                  },
                  scope3: {
                    current: 1850,
                    previous: 2120,
                    unit: "tons CO2e",
                    change: -12.7
                  },
                  total: {
                    current: 3050,
                    previous: 3480,
                    unit: "tons CO2e",
                    change: -12.4
                  }
                }
              }
            }
          ];
          
          for (const report of reportData) {
            const [createdReport] = await db.insert(reports).values(report).returning();
            console.log("Created report:", createdReport.id);
          }
        }
      }
      
      // 5. Create sample data points
      const existingDataPoints = await db.select().from(dataPoints);
      
      if (existingDataPoints.length === 0) {
        const allTemplates = await db.select().from(templates);
        
        if (allTemplates.length > 0) {
          const dataPointsToCreate = [
            // Template 1 - Environmental Performance
            {
              value: "1250",
              userId: demoUser.id,
              templateId: allTemplates[0].id,
              standardId: 5, // Emissions
              unit: "tons CO2e",
              period: "Annual 2023",
              isAnomaly: false,
              notes: null
            },
            {
              value: "45280",
              userId: demoUser.id,
              templateId: allTemplates[0].id,
              standardId: 2, // Energy
              unit: "MWh",
              period: "Annual 2023",
              isAnomaly: false,
              notes: null
            },
            {
              value: "186500",
              userId: demoUser.id,
              templateId: allTemplates[0].id,
              standardId: 3, // Water
              unit: "m³",
              period: "Annual 2023",
              isAnomaly: false,
              notes: null
            },
            // Template 2 - Comprehensive ESG
            {
              value: "98",
              userId: demoUser.id,
              templateId: allTemplates[1].id,
              standardId: 10, // Anti-corruption (Ethics training)
              unit: "% completed",
              period: "Q3 2023",
              isAnomaly: false,
              notes: null
            },
            {
              value: "4850",
              userId: demoUser.id,
              templateId: allTemplates[1].id,
              standardId: 6, // Employment (Training)
              unit: "hours",
              period: "Q3 2023",
              isAnomaly: false,
              notes: null
            },
            // An anomaly for testing
            {
              value: "25800",
              userId: demoUser.id,
              templateId: allTemplates[0].id,
              standardId: 2, // Energy
              unit: "MWh",
              period: "Q2 2023",
              isAnomaly: true,
              notes: "Unexpected spike in energy consumption - investigation pending"
            }
          ];
          
          for (const dataPoint of dataPointsToCreate) {
            const [createdDataPoint] = await db.insert(dataPoints).values(dataPoint).returning();
            console.log("Created data point:", createdDataPoint.id);
          }
        }
      }
      
      // 6. Create sample activity logs
      const existingActivityLogs = await db.select().from(activityLogs);
      
      if (existingActivityLogs.length === 0) {
        const activities = [
          {
            activity: "Template created",
            description: "Annual Environmental Performance Template created",
            userId: demoUser.id,
            status: "completed",
            timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
          },
          {
            activity: "Data ingestion",
            description: "Environmental data ingested from HR department",
            userId: demoUser.id,
            status: "completed",
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
          },
          {
            activity: "Report generated",
            description: "2023 Annual Environmental Report generated",
            userId: demoUser.id,
            status: "completed",
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
          },
          {
            activity: "Anomaly detected",
            description: "Energy consumption anomaly detected in Q2 2023 data",
            userId: demoUser.id,
            status: "needs_review",
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          },
          {
            activity: "Data ingestion",
            description: "Employee training data ingested from L&D department",
            userId: demoUser.id,
            status: "pending",
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          }
        ];
        
        for (const activity of activities) {
          const [createdActivity] = await db.insert(activityLogs).values(activity).returning();
          console.log("Created activity log:", createdActivity.id);
        }
      }
      
      console.log("Database seeding completed successfully!");
    } else {
      console.log("Database already contains data. Skipping seed operation.");
    }
    
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}