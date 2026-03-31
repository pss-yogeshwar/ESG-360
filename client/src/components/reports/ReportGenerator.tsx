import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { demoUser } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Template {
  id: number;
  name: string;
  description: string;
  userId: number;
  createdAt: string;
  standards: number[];
}

// Sample chart data - in a real app, this would be generated from actual template data
const environmentalData = [
  { name: "Energy", value: 78 },
  { name: "Water", value: 85 },
  { name: "Emissions", value: 62 },
  { name: "Waste", value: 71 },
  { name: "Biodiversity", value: 56 },
];

const socialData = [
  { name: "Diversity", value: 68 },
  { name: "Training", value: 72 },
  { name: "Safety", value: 81 },
  { name: "Community", value: 65 },
  { name: "Human Rights", value: 77 },
];

const governanceData = [
  { name: "Ethics", value: 83 },
  { name: "Transparency", value: 75 },
  { name: "Board Diversity", value: 62 },
  { name: "Anti-corruption", value: 79 },
  { name: "Tax Compliance", value: 86 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ReportGenerator() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [reportName, setReportName] = useState<string>("");
  const [reportDescription, setReportDescription] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/templates'],
  });

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async (reportData: {
      name: string;
      description: string;
      templateId: number;
      userId: number;
      reportData: any;
    }) => {
      const response = await apiRequest("POST", "/api/reports", reportData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
      setIsGenerating(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const handleGenerateReport = () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select a template",
        variant: "destructive",
      });
      return;
    }

    if (!reportName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a report name",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Sample report data structure - in a real app, this would be generated from actual data
    const sampleReportData = {
      overview: {
        environmentalScore: 72,
        socialScore: 68,
        governanceScore: 77,
        totalDataPoints: 124,
        completionRate: 92,
      },
      standards: {
        environmental: environmentalData,
        social: socialData,
        governance: governanceData,
      },
      insights: [
        "Water consumption reduced by 12% compared to previous quarter",
        "Energy efficiency has improved across all facilities",
        "Diversity metrics show positive trends in hiring practices",
        "Carbon emissions need attention in manufacturing sites",
      ],
    };

    generateReportMutation.mutate({
      name: reportName,
      description: reportDescription,
      templateId: parseInt(selectedTemplate),
      userId: demoUser.id,
      reportData: sampleReportData,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate ESG Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Template
              </label>
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
                disabled={templatesLoading || isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates?.map((template: Template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Name
              </label>
              <Input
                placeholder="E.g., Q2 2023 ESG Performance Report"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Description (Optional)
            </label>
            <Textarea
              placeholder="Describe the purpose and scope of this report"
              rows={3}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleGenerateReport}
              disabled={!selectedTemplate || !reportName || isGenerating}
              className="bg-primary hover:bg-primary-dark"
            >
              {isGenerating ? (
                <>Generating Report...</>
              ) : (
                <>
                  <i className="ri-bar-chart-box-line mr-2"></i>
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="environmental">Environmental</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="governance">Governance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 border rounded-lg bg-green-50">
                  <h3 className="text-lg font-semibold text-gray-800">Environmental</h3>
                  <div className="text-3xl font-bold text-primary mt-2">72%</div>
                  <p className="text-sm text-gray-500 mt-1">
                    <i className="ri-arrow-up-line text-success"></i> 4% from last quarter
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50">
                  <h3 className="text-lg font-semibold text-gray-800">Social</h3>
                  <div className="text-3xl font-bold text-primary mt-2">68%</div>
                  <p className="text-sm text-gray-500 mt-1">
                    <i className="ri-arrow-up-line text-success"></i> 2% from last quarter
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-yellow-50">
                  <h3 className="text-lg font-semibold text-gray-800">Governance</h3>
                  <div className="text-3xl font-bold text-primary mt-2">77%</div>
                  <p className="text-sm text-gray-500 mt-1">
                    <i className="ri-arrow-down-line text-error"></i> 1% from last quarter
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ESG Performance Overview</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Environmental", score: 72 },
                        { name: "Social", score: 68 },
                        { name: "Governance", score: 77 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="Score" fill="#0D7184" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-success text-lg mr-2 mt-0.5"></i>
                    <span>Water consumption reduced by 12% compared to previous quarter</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-success text-lg mr-2 mt-0.5"></i>
                    <span>Energy efficiency has improved across all facilities</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-checkbox-circle-line text-success text-lg mr-2 mt-0.5"></i>
                    <span>Diversity metrics show positive trends in hiring practices</span>
                  </li>
                  <li className="flex items-start">
                    <i className="ri-error-warning-line text-error text-lg mr-2 mt-0.5"></i>
                    <span>Carbon emissions need attention in manufacturing sites</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="environmental">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Environmental Performance</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={environmentalData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Score" fill="#4CAF50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Environmental Categories</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={environmentalData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {environmentalData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Performance</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={socialData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Score" fill="#0D7184" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Categories</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={socialData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {socialData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="governance">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Governance Performance</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={governanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Score" fill="#FFC045" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Governance Categories</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={governanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {governanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
