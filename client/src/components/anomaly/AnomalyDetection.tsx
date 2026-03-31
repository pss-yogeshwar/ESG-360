import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { demoUser } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  id: number;
  templateId: number;
  standardId: number;
  value: string;
  unit: string;
  period: string;
  isAnomaly: boolean;
  notes: string;
  createdAt: string;
  userId: number;
}

interface Standard {
  id: number;
  code: string;
  name: string;
  description: string;
}

export default function AnomalyDetection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/templates'],
  });

  // Fetch data points for selected template
  const { data: dataPoints, isLoading: dataPointsLoading } = useQuery({
    queryKey: ['/api/data-points/template', selectedTemplate],
    enabled: !!selectedTemplate,
  });

  // Fetch standards for reference
  const { data: standards, isLoading: standardsLoading } = useQuery({
    queryKey: ['/api/gri-standards'],
  });

  // Mutation to update a data point (mark as reviewed)
  const updateDataPointMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<DataPoint> }) => {
      const response = await apiRequest("PUT", `/api/data-points/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Data point updated successfully" });
      
      // Invalidate queries to refresh data
      if (selectedTemplate) {
        queryClient.invalidateQueries({ queryKey: ['/api/data-points/template', selectedTemplate] });
      }
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to update data point", 
        variant: "destructive" 
      });
    },
  });

  // Handle marking an anomaly as reviewed
  const handleMarkAsReviewed = (dataPoint: DataPoint) => {
    updateDataPointMutation.mutate({
      id: dataPoint.id,
      data: {
        isAnomaly: false,
        notes: dataPoint.notes + " [Reviewed and corrected]"
      }
    });
  };

  // Find standard information by ID
  const getStandardInfo = (standardId: number) => {
    if (!standards) return { code: "Unknown", name: "Unknown" };
    const standard = standards.find((s: Standard) => s.id === standardId);
    return standard || { code: "Unknown", name: "Unknown" };
  };

  // Filter for anomalies
  const anomalies = dataPoints ? dataPoints.filter((dp: DataPoint) => dp.isAnomaly) : [];

  // Function to scan data for anomalies
  const scanForAnomalies = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select a template first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Scanning",
      description: "Analyzing data for anomalies...",
    });

    // In a real app, this would trigger a more sophisticated algorithm
    // For now, we'll just invalidate the query to refresh the data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (selectedTemplate) {
      queryClient.invalidateQueries({ queryKey: ['/api/data-points/template', selectedTemplate] });
    }

    toast({
      title: "Scan Complete",
      description: `Found ${anomalies.length} potential anomalies`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ESG Data Anomaly Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Template
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={selectedTemplate || ""}
                onChange={(e) => setSelectedTemplate(Number(e.target.value))}
                disabled={templatesLoading}
              >
                <option value="">Select a template</option>
                {templates?.map((template: any) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={scanForAnomalies}
                disabled={!selectedTemplate || dataPointsLoading}
                className="bg-primary hover:bg-primary-dark"
              >
                <i className="ri-search-line mr-2"></i>
                Scan for Anomalies
              </Button>
            </div>
          </div>

          {dataPointsLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading data points...</p>
            </div>
          )}

          {!dataPointsLoading && selectedTemplate && anomalies.length === 0 && (
            <div className="text-center py-8 border rounded-lg">
              <i className="ri-check-line text-secondary text-4xl"></i>
              <p className="text-gray-700 mt-2">No anomalies detected in the selected template.</p>
            </div>
          )}

          {!dataPointsLoading && selectedTemplate && anomalies.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Detected Anomalies
                <Badge className="ml-2 bg-error">{anomalies.length}</Badge>
              </h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>GRI Standard</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Date Detected</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {anomalies.map((anomaly: DataPoint) => {
                    const standard = getStandardInfo(anomaly.standardId);
                    return (
                      <TableRow key={anomaly.id}>
                        <TableCell>
                          <div className="font-medium">{standard.code}</div>
                          <div className="text-sm text-gray-500">{standard.name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="font-mono">
                            {anomaly.value} {anomaly.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>{anomaly.period}</TableCell>
                        <TableCell className="max-w-xs truncate">{anomaly.notes || "No notes"}</TableCell>
                        <TableCell>{new Date(anomaly.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkAsReviewed(anomaly)}
                            disabled={updateDataPointMutation.isPending}
                          >
                            Mark as Reviewed
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Anomaly Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                <i className="ri-robot-line text-primary text-xl"></i>
              </div>
              <h3 className="text-md font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-gray-600">
                Our AI system analyzes your ESG data to identify statistical outliers and potential reporting errors.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
                <i className="ri-line-chart-line text-secondary text-xl"></i>
              </div>
              <h3 className="text-md font-semibold mb-2">Pattern Recognition</h3>
              <p className="text-sm text-gray-600">
                Detect unusual patterns in your sustainability data that may indicate measurement issues or real changes.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center mb-3">
                <i className="ri-shield-check-line text-warning text-xl"></i>
              </div>
              <h3 className="text-md font-semibold mb-2">Data Quality Assurance</h3>
              <p className="text-sm text-gray-600">
                Ensure the accuracy and reliability of your ESG reporting with automated data validation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
