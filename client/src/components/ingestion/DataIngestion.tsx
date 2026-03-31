import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { demoUser } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DataIngestion() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [ingestProgress, setIngestProgress] = useState(0);
  const [isIngesting, setIsIngesting] = useState(false);

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/templates'],
  });

  // Mutation for data ingestion
  const ingestDataMutation = useMutation({
    mutationFn: async (data: { userId: number; templateId: number; description: string }) => {
      const response = await apiRequest("POST", "/api/data-ingestion/microsoft", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Data successfully ingested to Microsoft Sustainability Manager",
      });
      setIngestProgress(100);
      
      // Reset after completion
      setTimeout(() => {
        setIsIngesting(false);
        setIngestProgress(0);
      }, 1500);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to ingest data to Microsoft Sustainability Manager",
        variant: "destructive",
      });
      setIsIngesting(false);
      setIngestProgress(0);
    },
  });

  const handleDataIngestion = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select a template first",
        variant: "destructive",
      });
      return;
    }

    setIsIngesting(true);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setIngestProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    // Perform the actual ingestion
    ingestDataMutation.mutate({
      userId: demoUser.id,
      templateId: selectedTemplate,
      description: description || `Data ingested from template to Microsoft Sustainability Manager`
    });
  };

  const departmentsList = [
    {
      id: 1,
      name: "Human Resources",
      description: "Personnel data, employee composition, diversity metrics",
      status: "connected"
    },
    {
      id: 2,
      name: "Learning & Development",
      description: "Training hours, career development metrics, certifications",
      status: "connected"
    },
    {
      id: 3,
      name: "Legal",
      description: "Compliance records, legal proceedings, regulatory filings",
      status: "pending"
    },
    {
      id: 4,
      name: "Compliance",
      description: "Regulatory adherence, policy implementation, audits",
      status: "connected"
    },
    {
      id: 5,
      name: "Procurement",
      description: "Supplier diversity, sustainable sourcing, supply chain data",
      status: "connected"
    },
    {
      id: 6,
      name: "CSR",
      description: "Community programs, donations, social impact metrics",
      status: "connected"
    },
    {
      id: 7,
      name: "Corporate Affairs",
      description: "Stakeholder relations, policy advocacy, governance",
      status: "pending"
    },
    {
      id: 8,
      name: "PR",
      description: "Communications data, media coverage, stakeholder feedback",
      status: "connected"
    },
    {
      id: 9,
      name: "Facilities",
      description: "Building efficiency, waste management, space utilization",
      status: "connected"
    },
    {
      id: 10,
      name: "Operations",
      description: "Operational metrics, resource use, productivity data",
      status: "connected"
    },
    {
      id: 11,
      name: "Engineering",
      description: "Product design, resource efficiency, innovation metrics",
      status: "pending"
    },
    {
      id: 12,
      name: "Sustainability",
      description: "Carbon metrics, water usage, environmental impacts",
      status: "connected"
    },
    {
      id: 13,
      name: "Environmental Management",
      description: "Compliance, resource management, impact assessments",
      status: "pending_approval"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Microsoft Sustainability Manager Integration</CardTitle>
          <CardDescription>
            Ingest your ESG data directly to Microsoft Sustainability Manager using Microsoft Fabric
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Data Template
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={selectedTemplate || ""}
                onChange={(e) => setSelectedTemplate(Number(e.target.value))}
                disabled={templatesLoading || isIngesting}
              >
                <option value="">Select a template</option>
                {templates?.map((template: any) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="E.g., Q2 2023 Environmental Data"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isIngesting}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={handleDataIngestion}
              disabled={!selectedTemplate || isIngesting}
              className="bg-primary hover:bg-primary-dark"
            >
              <i className="ri-upload-cloud-2-line mr-2"></i>
              Ingest Data to Microsoft Sustainability Manager
            </Button>
            
            <div className="flex items-center text-sm text-gray-500">
              <i className="ri-microsoft-line mr-1 text-lg"></i>
              Using Microsoft Fabric
            </div>
          </div>
          
          {isIngesting && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Ingestion Progress</span>
                <span className="text-sm text-gray-500">{ingestProgress}%</span>
              </div>
              <Progress value={ingestProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                Transferring data to Microsoft Sustainability Manager...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Department Data Sources</CardTitle>
          <CardDescription>
            Configure and manage data ingestion from various departments across your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium">Department Connection Status</h3>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Connected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">Needs Approval</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentsList.map((dept) => (
              <div 
                key={dept.id} 
                className={`border rounded-lg p-4 hover:shadow-md transition-all ${
                  dept.status === "pending_approval" ? "border-blue-200 bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{dept.name}</h3>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    dept.status === "connected" 
                      ? "bg-green-100 text-green-800" 
                      : dept.status === "pending" 
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                  }`}>
                    {dept.status === "connected" 
                      ? "Connected" 
                      : dept.status === "pending" 
                        ? "Pending"
                        : "Needs Approval"}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                
                {dept.status === "pending_approval" && (
                  <div className="bg-white border border-blue-200 rounded-md p-2 mb-3">
                    <div className="flex items-center text-sm text-blue-800 mb-1">
                      <i className="ri-information-line mr-1"></i>
                      <span className="font-medium">Approval Required</span>
                    </div>
                    <p className="text-xs text-gray-600">New data available from {dept.name}. Review and approve to include in your ESG reporting.</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex-1 text-xs border-gray-300 flex items-center justify-center ${
                      dept.status === "pending_approval" ? "border-blue-300 text-blue-700" : ""
                    }`}
                  >
                    {dept.status === "connected" 
                      ? <><i className="ri-restart-line mr-1"></i> Update</>
                      : dept.status === "pending"
                        ? <><i className="ri-link-m mr-1"></i> Connect</>
                        : <><i className="ri-check-double-line mr-1"></i> Approve</>}
                  </Button>
                  
                  {dept.status === "connected" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-gray-300 flex items-center justify-center"
                    >
                      <i className="ri-history-line mr-1"></i> History
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Transformation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                <i className="ri-file-transfer-line text-primary text-xl"></i>
              </div>
              <div>
                <h3 className="text-md font-semibold">Automated Mapping</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Automatically maps your GRI standard data to Microsoft Sustainability Manager's data structure.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seamless Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-3">
                <i className="ri-link text-secondary text-xl"></i>
              </div>
              <div>
                <h3 className="text-md font-semibold">Direct Connection</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Establish a direct connection between your ESG data and Microsoft's sustainability tools.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Governance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mr-3">
                <i className="ri-shield-check-line text-warning text-xl"></i>
              </div>
              <div>
                <h3 className="text-md font-semibold">Secure Transfer</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Ensures secure, authenticated data transfer with detailed audit logging for compliance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
