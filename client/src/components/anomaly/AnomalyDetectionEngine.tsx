import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Schema for anomaly detection settings
const anomalySettingsSchema = z.object({
  dataSource: z.string().min(1, "Data source is required"),
  threshold: z.number().min(0).max(100),
  algorithm: z.enum(["statistical", "machinelearning", "deeplearning", "ensemble"], {
    required_error: "Please select an anomaly detection algorithm",
  }),
  automaticCleansing: z.boolean().default(false),
  notifyOnDetection: z.boolean().default(true),
  sensitivityLevel: z.number().min(1).max(10).default(5),
  excludeFields: z.array(z.string()).default([]),
});

// Schema for manual anomaly review
const anomalyReviewSchema = z.object({
  action: z.enum(["keep", "remove", "replace", "flag"]),
  replacementValue: z.string().optional(),
  notes: z.string().optional(),
});

// Type definitions
type AnomalySettings = z.infer<typeof anomalySettingsSchema>;
type AnomalyReview = z.infer<typeof anomalyReviewSchema>;

interface Anomaly {
  id: number;
  templateId: number;
  standardId: number;
  dataPointId: number;
  value: string;
  expectedValue: string;
  confidence: number;
  detectionMethod: string;
  timestamp: string;
  status: "pending" | "reviewed" | "fixed" | "ignored";
  source: string;
}

export default function AnomalyDetectionEngine() {
  const [activeTab, setActiveTab] = useState("detected");
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Form for anomaly detection settings
  const settingsForm = useForm<AnomalySettings>({
    resolver: zodResolver(anomalySettingsSchema),
    defaultValues: {
      dataSource: "all",
      threshold: 75,
      algorithm: "statistical",
      automaticCleansing: false,
      notifyOnDetection: true,
      sensitivityLevel: 5,
      excludeFields: [],
    },
  });

  // Form for anomaly review
  const reviewForm = useForm<AnomalyReview>({
    resolver: zodResolver(anomalyReviewSchema),
    defaultValues: {
      action: "flag",
      replacementValue: "",
      notes: "",
    },
  });

  // Query for fetching templates
  const { data: templates = [] } = useQuery({
    queryKey: ["/api/templates"],
  });

  // Query for fetching detected anomalies
  const { data: anomalies = [], isLoading: isAnomaliesLoading } = useQuery({
    queryKey: ["/api/anomalies"],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load anomalies data",
        variant: "destructive",
      });
    },
  });

  // Query for fetching anomaly detection settings
  const { data: settings } = useQuery({
    queryKey: ["/api/anomaly-settings"],
    onSuccess: (data) => {
      if (data) {
        settingsForm.reset(data);
      }
    },
  });

  // Mutation for updating anomaly settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: AnomalySettings) => {
      return await apiRequest({
        url: "/api/anomaly-settings",
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anomaly-settings"] });
      setIsSettingsDialogOpen(false);
      toast({
        title: "Success",
        description: "Anomaly detection settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update anomaly detection settings",
        variant: "destructive",
      });
    },
  });

  // Mutation for reviewing anomalies
  const reviewAnomalyMutation = useMutation({
    mutationFn: async (data: { id: number; review: AnomalyReview }) => {
      return await apiRequest({
        url: `/api/anomalies/${data.id}/review`,
        method: "POST",
        data: data.review,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anomalies"] });
      setIsReviewDialogOpen(false);
      reviewForm.reset();
      toast({
        title: "Success",
        description: "Anomaly reviewed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update anomaly review",
        variant: "destructive",
      });
    },
  });

  // Mutation for triggering anomaly detection scan
  const scanForAnomaliesMutation = useMutation({
    mutationFn: async (templateId: string) => {
      return await apiRequest({
        url: "/api/anomalies/scan",
        method: "POST",
        data: { templateId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anomalies"] });
      toast({
        title: "Success",
        description: "Anomaly detection scan completed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete anomaly detection scan",
        variant: "destructive",
      });
    },
  });

  // Function to start a mock scan with progress animation
  const startScan = async (templateId: string) => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate progressive scan for UI feedback
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
    
    // Call the actual scan mutation after delay for demo
    setTimeout(() => {
      scanForAnomaliesMutation.mutate(templateId);
      setIsScanning(false);
      clearInterval(interval);
      setScanProgress(100);
      
      // Reset progress after completion
      setTimeout(() => setScanProgress(0), 1000);
    }, 6000);
  };

  // Handler for settings form submission
  const onSettingsSubmit = (data: AnomalySettings) => {
    updateSettingsMutation.mutate(data);
  };

  // Handler for anomaly review form submission
  const onReviewSubmit = (data: AnomalyReview) => {
    if (selectedAnomaly) {
      reviewAnomalyMutation.mutate({
        id: selectedAnomaly.id,
        review: data,
      });
    }
  };

  // Handler for opening review dialog
  const handleReviewAnomaly = (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly);
    reviewForm.reset({
      action: "flag",
      replacementValue: "",
      notes: "",
    });
    setIsReviewDialogOpen(true);
  };

  // Function to filter anomalies by status
  const filterAnomaliesByStatus = (status: string) => {
    if (status === "all") return anomalies;
    return anomalies.filter((anomaly: Anomaly) => anomaly.status === status);
  };

  // Get anomalies based on active tab
  const filteredAnomalies = activeTab === "detected" 
    ? filterAnomaliesByStatus("pending")
    : activeTab === "reviewed" 
      ? filterAnomaliesByStatus("reviewed") 
      : filterAnomaliesByStatus("fixed");

  return (
    <div className="space-y-6">
      {/* Header with title and scan button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI-Powered Anomaly Detection</h2>
          <p className="text-muted-foreground">
            Automatically detect and cleanse anomalies in your ESG data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select disabled={isScanning}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select template to scan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              {templates.map((template: any) => (
                <SelectItem key={template.id} value={template.id.toString()}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => startScan("all")} 
            disabled={isScanning}
          >
            <i className="ri-radar-line mr-1"></i>
            {isScanning ? "Scanning..." : "Scan for Anomalies"}
          </Button>
          <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <i className="ri-settings-3-line mr-1"></i> Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Anomaly Detection Settings</DialogTitle>
                <DialogDescription>
                  Configure how AI detects and processes data anomalies
                </DialogDescription>
              </DialogHeader>
              <Form {...settingsForm}>
                <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-4">
                  <FormField
                    control={settingsForm.control}
                    name="dataSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Source</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select data source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All Data</SelectItem>
                            <SelectItem value="environmental">Environmental Data</SelectItem>
                            <SelectItem value="social">Social Data</SelectItem>
                            <SelectItem value="governance">Governance Data</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={settingsForm.control}
                    name="algorithm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detection Algorithm</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="statistical">Statistical (z-score, IQR)</SelectItem>
                            <SelectItem value="machinelearning">Machine Learning (Isolation Forest)</SelectItem>
                            <SelectItem value="deeplearning">Deep Learning (Autoencoder)</SelectItem>
                            <SelectItem value="ensemble">Ensemble Methods</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Different algorithms are suited to different types of anomalies
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={settingsForm.control}
                    name="threshold"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>Detection Threshold ({value}%)</FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[value]}
                            max={100}
                            step={1}
                            onValueChange={(vals) => onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Higher threshold means fewer anomalies will be detected
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={settingsForm.control}
                    name="sensitivityLevel"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>Sensitivity Level ({value}/10)</FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[value]}
                            max={10}
                            min={1}
                            step={1}
                            onValueChange={(vals) => onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Higher sensitivity detects more subtle anomalies but may increase false positives
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={settingsForm.control}
                      name="automaticCleansing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Automatic Cleansing</FormLabel>
                            <FormDescription>
                              Automatically correct detected anomalies
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={settingsForm.control}
                      name="notifyOnDetection"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Notification Alerts</FormLabel>
                            <FormDescription>
                              Send alerts when anomalies are detected
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsSettingsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateSettingsMutation.isPending}
                    >
                      {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Progress bar for scanning */}
      {isScanning && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Scanning data for anomalies...</span>
                <span className="text-sm">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Processing templates, standards, and data points</span>
                <span>{Math.round((scanProgress / 100) * 2453)} / 2453 records</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detected">Detected Anomalies</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          <TabsTrigger value="cleansed">Cleansed Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detected" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detected Anomalies</CardTitle>
              <CardDescription>
                AI-detected anomalies requiring review and action
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnomaliesLoading ? (
                <div className="flex justify-center py-8">
                  <p>Loading anomalies...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Standard</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Expected Range</TableHead>
                      <TableHead>Detection Method</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Detected</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnomalies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                          No anomalies detected. Your data looks clean!
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAnomalies.map((anomaly: Anomaly) => (
                        <TableRow key={anomaly.id}>
                          <TableCell className="font-medium">GRI {anomaly.source}</TableCell>
                          <TableCell className="text-red-500">{anomaly.value}</TableCell>
                          <TableCell>{anomaly.expectedValue}</TableCell>
                          <TableCell>{anomaly.detectionMethod}</TableCell>
                          <TableCell>
                            <Badge variant={
                              anomaly.confidence > 90 ? "destructive" :
                              anomaly.confidence > 70 ? "default" : "outline"
                            }>
                              {anomaly.confidence}%
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(anomaly.timestamp).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReviewAnomaly(anomaly)}
                            >
                              <i className="ri-edit-line mr-1"></i> Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Detection Analytics</CardTitle>
              <CardDescription>
                Insights on anomaly patterns and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Anomaly Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Environmental</span>
                      <span className="text-xs font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-1.5" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Social</span>
                      <span className="text-xs font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-1.5" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Governance</span>
                      <span className="text-xs font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-1.5" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Anomaly Types</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Outliers</span>
                      <span className="text-xs font-medium">48%</span>
                    </div>
                    <Progress value={48} className="h-1.5" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Missing Values</span>
                      <span className="text-xs font-medium">32%</span>
                    </div>
                    <Progress value={32} className="h-1.5" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Format Issues</span>
                      <span className="text-xs font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-1.5" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Confidence Levels</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">High (&gt;90%)</span>
                      <span className="text-xs font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-1.5" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Medium (70-90%)</span>
                      <span className="text-xs font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-1.5" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Low (&lt;70%)</span>
                      <span className="text-xs font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-1.5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviewed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reviewed Anomalies</CardTitle>
              <CardDescription>
                Anomalies that have been reviewed but not yet resolved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Standard</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Expected Range</TableHead>
                    <TableHead>Reviewed By</TableHead>
                    <TableHead>Action Taken</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">GRI 305-1</TableCell>
                    <TableCell className="text-red-500">15,246 tCO₂e</TableCell>
                    <TableCell>1,200 - 5,000 tCO₂e</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>Flag for investigation</TableCell>
                    <TableCell>Possible reporting error</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">Pending</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cleansed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cleansed Data</CardTitle>
              <CardDescription>
                Anomalies that have been successfully cleansed and corrected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Standard</TableHead>
                    <TableHead>Original Value</TableHead>
                    <TableHead>Corrected Value</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Corrected By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">GRI 303-3</TableCell>
                    <TableCell className="line-through">234,567 gal</TableCell>
                    <TableCell className="text-green-600">234.567 ML</TableCell>
                    <TableCell>Unit Conversion</TableCell>
                    <TableCell>System (Auto)</TableCell>
                    <TableCell>Yesterday</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="default" className="bg-green-600">Corrected</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cleansing Analytics</CardTitle>
              <CardDescription>
                Statistics on data cleansing operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <span className="text-3xl font-bold text-green-600">93%</span>
                  <span className="text-sm text-gray-500">Success Rate</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <span className="text-3xl font-bold">42</span>
                  <span className="text-sm text-gray-500">Issues Resolved</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <span className="text-3xl font-bold">8</span>
                  <span className="text-sm text-gray-500">Manual Interventions</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <span className="text-3xl font-bold">5.2</span>
                  <span className="text-sm text-gray-500">Avg Hours Saved/Week</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Anomaly Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Review Anomaly</DialogTitle>
            <DialogDescription>
              Evaluate and take action on the detected anomaly
            </DialogDescription>
          </DialogHeader>
          {selectedAnomaly && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium mb-1">Standard</h4>
                  <p>GRI {selectedAnomaly.source}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Data Point ID</h4>
                  <p>{selectedAnomaly.dataPointId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Detected Value</h4>
                  <p className="text-red-500">{selectedAnomaly.value}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Expected Range</h4>
                  <p>{selectedAnomaly.expectedValue}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Detection Method</h4>
                  <p>{selectedAnomaly.detectionMethod}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Confidence</h4>
                  <Badge variant={
                    selectedAnomaly.confidence > 90 ? "destructive" :
                    selectedAnomaly.confidence > 70 ? "default" : "outline"
                  }>
                    {selectedAnomaly.confidence}%
                  </Badge>
                </div>
              </div>
              
              <Form {...reviewForm}>
                <form onSubmit={reviewForm.handleSubmit(onReviewSubmit)} className="space-y-4">
                  <FormField
                    control={reviewForm.control}
                    name="action"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Action to Take</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="keep">Keep Value (Not an Anomaly)</SelectItem>
                            <SelectItem value="flag">Flag for Further Review</SelectItem>
                            <SelectItem value="remove">Remove Value (Mark as Missing)</SelectItem>
                            <SelectItem value="replace">Replace with Corrected Value</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {reviewForm.watch("action") === "replace" && (
                    <FormField
                      control={reviewForm.control}
                      name="replacementValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Replacement Value</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter corrected value" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={reviewForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Add notes about this anomaly" />
                        </FormControl>
                        <FormDescription>
                          Optional notes for documentation and future reference
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsReviewDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={reviewAnomalyMutation.isPending}
                    >
                      {reviewAnomalyMutation.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}