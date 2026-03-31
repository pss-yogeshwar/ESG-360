import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsCard from "@/components/dashboard/StatsCard";
import ESGPerformanceChart from "@/components/dashboard/ESGPerformanceChart";
import AIAssistantWidget from "@/components/dashboard/AIAssistantWidget";
import FeatureCard from "@/components/dashboard/FeatureCard";
import ActivityTable from "@/components/dashboard/ActivityTable";

export default function Dashboard() {
  return (
    <div>
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Dashboard Overview */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Templates Created"
            value="24"
            icon="ri-file-list-3-line"
            iconBgColor="bg-blue-50"
            changePercentage={8}
          />
          <StatsCard
            title="Data Points Collected"
            value="5,283"
            icon="ri-database-2-line"
            iconBgColor="bg-green-50"
            changePercentage={12}
          />
          <StatsCard
            title="Anomalies Detected"
            value="18"
            icon="ri-error-warning-line"
            iconBgColor="bg-orange-50"
            changePercentage={3}
          />
          <StatsCard
            title="Reports Generated"
            value="7"
            icon="ri-bar-chart-box-line"
            iconBgColor="bg-purple-50"
            changePercentage={5}
          />
        </div>

        {/* Chart and AI Assistant Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* ESG Performance Chart */}
          <ESGPerformanceChart />

          {/* AI Assistant Widget */}
          <AIAssistantWidget />
        </div>
      </div>

      {/* ESG Tools & Features Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">ESG Tools & Features</h2>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <FeatureCard
            title="GRI Template Generator"
            description="Generate custom data templates based on GRI standards for efficient data capture."
            icon="ri-file-list-3-line"
            iconBgColor="bg-blue-50"
            buttonText="Create Template"
            linkTo="/templates"
          />
          <FeatureCard
            title="Anomaly Detection"
            description="AI-powered detection of data anomalies and outliers in your ESG datasets."
            icon="ri-error-warning-line"
            iconBgColor="bg-red-50"
            buttonText="Scan Data"
            linkTo="/anomaly"
          />
          <FeatureCard
            title="Microsoft Integration"
            description="Ingest data directly to Microsoft Sustainability Manager using Microsoft Fabric."
            icon="ri-upload-cloud-2-line"
            iconBgColor="bg-green-50"
            buttonText="Configure"
            linkTo="/ingestion"
          />
          <FeatureCard
            title="Digital ESG Assistant"
            description="AI-powered assistant to help query and analyze your existing ESG data."
            icon="ri-robot-line"
            iconBgColor="bg-purple-50"
            buttonText="Ask Questions"
            linkTo="/assistant"
          />
          <FeatureCard
            title="ESG Reporting"
            description="Generate comprehensive reports and visualizations of your ESG performance."
            icon="ri-bar-chart-box-line"
            iconBgColor="bg-yellow-50"
            buttonText="Create Report"
            linkTo="/reports"
          />
          <FeatureCard
            title="Data Cleansing"
            description="Automated tools to clean, standardize and validate your ESG datasets."
            icon="ri-database-2-line"
            iconBgColor="bg-blue-50"
            buttonText="Clean Data"
            linkTo="/anomaly"
          />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          <button className="text-sm text-primary hover:text-primary-dark font-medium">View All</button>
        </div>

        <ActivityTable />
      </div>
    </div>
  );
}
