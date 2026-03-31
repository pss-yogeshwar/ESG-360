import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import GRITemplateGenerator from "@/components/templates/GRITemplateGenerator";

interface Template {
  id: number;
  name: string;
  description: string;
  userId: number;
  createdAt: string;
  standards: number[];
}

export default function DataTemplates() {
  const [activeTab, setActiveTab] = useState("generate");
  const { toast } = useToast();
  
  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/templates'],
  });
  
  // Fetch GRI standards for reference
  const { data: griStandards, isLoading: standardsLoading } = useQuery({
    queryKey: ['/api/gri-standards'],
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get standard name by ID
  const getStandardName = (standardId: number) => {
    if (!griStandards) return "Loading...";
    const standard = griStandards.find((s: any) => s.id === standardId);
    return standard ? `${standard.code}: ${standard.name}` : "Unknown";
  };
  
  const handleExportTemplate = (templateId: number) => {
    // In a real application, this would export the template to a file
    toast({
      title: "Template Exported",
      description: "The template has been exported as CSV",
    });
  };
  
  const handleDeleteTemplate = (templateId: number) => {
    // In a real application, this would delete the template
    toast({
      title: "Not Implemented",
      description: "Delete functionality is not implemented in this demo",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>GRI Data Templates</CardTitle>
          <CardDescription>
            Create, manage, and export data templates based on GRI standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="generate">Generate Template</TabsTrigger>
              <TabsTrigger value="saved">
                Saved Templates
                {templates && templates.length > 0 && (
                  <Badge className="ml-2 bg-primary">{templates.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate">
              <GRITemplateGenerator />
            </TabsContent>
            
            <TabsContent value="saved">
              {templatesLoading || standardsLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading templates...</p>
                </div>
              ) : templates && templates.length > 0 ? (
                <div className="space-y-4">
                  {templates.map((template: Template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                          <p className="text-sm text-gray-500">
                            Created: {formatDate(template.createdAt)}
                          </p>
                          {template.description && (
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0">
                          <Button variant="outline" size="sm" onClick={() => handleExportTemplate(template.id)}>
                            <i className="ri-download-line mr-1"></i> Export
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                            <i className="ri-delete-bin-line mr-1"></i> Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Included Standards:</h4>
                        <div className="flex flex-wrap gap-2">
                          {template.standards.map((standardId) => (
                            <Badge key={standardId} variant="outline" className="bg-neutral-light">
                              {getStandardName(standardId)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <i className="ri-file-list-3-line text-primary text-4xl"></i>
                  <p className="text-gray-700 mt-2">No templates found</p>
                  <p className="text-gray-500 text-sm mt-1">Create your first template to get started</p>
                  <Button 
                    className="mt-4 bg-primary hover:bg-primary-dark" 
                    onClick={() => setActiveTab("generate")}
                  >
                    Create Template
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>About GRI Standards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What are GRI Standards?</h3>
              <p className="text-gray-600">
                The GRI Standards are the world's most widely used standards for sustainability reporting. 
                They represent global best practice for reporting publicly on economic, environmental and 
                social impacts.
              </p>
              <p className="text-gray-600 mt-2">
                The modular structure of the GRI Standards enables organizations to report on their material
                impacts in a transparent and credible way.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Benefits of GRI Reporting</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>Improved sustainability performance through regular monitoring</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>Enhanced stakeholder engagement and trust</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>Better risk management through comprehensive reporting</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-secondary mr-2 mt-1"></i>
                  <span>Compliance with growing regulatory requirements</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
