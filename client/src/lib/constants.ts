// Main navigation items
export const navigationItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: "ri-dashboard-line"
  },
  {
    name: "Data Templates",
    path: "/templates",
    icon: "ri-file-list-3-line"
  },
  {
    name: "AI Assistant",
    path: "/assistant",
    icon: "ri-robot-line"
  },
  {
    name: "Anomaly Detection",
    path: "/anomaly",
    icon: "ri-search-line"
  },
  {
    name: "Data Ingestion",
    path: "/ingestion",
    icon: "ri-upload-cloud-2-line"
  },
  {
    name: "Reports",
    path: "/reports",
    icon: "ri-bar-chart-box-line"
  }
];

// Configuration navigation items
export const configurationItems = [
  {
    name: "Settings",
    path: "/settings",
    icon: "ri-settings-line"
  },
  {
    name: "User Management",
    path: "/users",
    icon: "ri-user-settings-line"
  },
  {
    name: "Microsoft Integrations",
    path: "/integrations",
    icon: "ri-microsoft-line"
  }
];

// GRI standards categories
export const griCategories = [
  {
    id: "universal",
    name: "GRI Universal Standards",
    description: "Foundation for all GRI reporting (GRI 1, 2, 3)"
  },
  {
    id: "environmental",
    name: "Environmental Standards",
    description: "Standards related to environmental impacts (GRI 300 series)"
  },
  {
    id: "social",
    name: "Social Standards",
    description: "Standards related to social impacts (GRI 400 series)"
  },
  {
    id: "governance",
    name: "Governance Standards",
    description: "Standards related to economic and governance (GRI 200 series)"
  }
];

// Environmental GRI standards
export const environmentalStandards = [
  { id: "gri-301", code: "GRI 301", name: "Materials" },
  { id: "gri-302", code: "GRI 302", name: "Energy" },
  { id: "gri-303", code: "GRI 303", name: "Water and Effluents" },
  { id: "gri-304", code: "GRI 304", name: "Biodiversity" },
  { id: "gri-305", code: "GRI 305", name: "Emissions" },
  { id: "gri-306", code: "GRI 306", name: "Waste" },
  { id: "gri-307", code: "GRI 307", name: "Environmental Compliance" },
  { id: "gri-308", code: "GRI 308", name: "Supplier Environmental Assessment" }
];

// Social GRI standards
export const socialStandards = [
  { id: "gri-401", code: "GRI 401", name: "Employment" },
  { id: "gri-402", code: "GRI 402", name: "Labor/Management Relations" },
  { id: "gri-403", code: "GRI 403", name: "Occupational Health and Safety" },
  { id: "gri-404", code: "GRI 404", name: "Training and Education" },
  { id: "gri-405", code: "GRI 405", name: "Diversity and Equal Opportunity" },
  { id: "gri-406", code: "GRI 406", name: "Non-discrimination" },
  { id: "gri-413", code: "GRI 413", name: "Local Communities" },
  { id: "gri-414", code: "GRI 414", name: "Supplier Social Assessment" },
  { id: "gri-415", code: "GRI 415", name: "Public Policy" },
  { id: "gri-416", code: "GRI 416", name: "Customer Health and Safety" },
  { id: "gri-417", code: "GRI 417", name: "Marketing and Labeling" },
  { id: "gri-418", code: "GRI 418", name: "Customer Privacy" }
];

// Governance GRI standards
export const governanceStandards = [
  { id: "gri-201", code: "GRI 201", name: "Economic Performance" },
  { id: "gri-202", code: "GRI 202", name: "Market Presence" },
  { id: "gri-203", code: "GRI 203", name: "Indirect Economic Impacts" },
  { id: "gri-204", code: "GRI 204", name: "Procurement Practices" },
  { id: "gri-205", code: "GRI 205", name: "Anti-corruption" },
  { id: "gri-206", code: "GRI 206", name: "Anti-competitive Behavior" },
  { id: "gri-207", code: "GRI 207", name: "Tax" }
];

// Demo user
export const demoUser = {
  id: 1,
  username: "demo",
  fullName: "John Smith",
  role: "ESG Administrator"
};
