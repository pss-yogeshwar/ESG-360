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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Microsoft integration configuration schema
const microsoftConfigSchema = z.object({
  tenantId: z.string().min(1, "Microsoft Tenant ID is required"),
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  sustainabilityManagerUrl: z.string().url("Must be a valid URL"),
  fabricWorkspaceUrl: z.string().url("Must be a valid URL"),
  syncEnabled: z.boolean().default(false),
  syncInterval: z.enum(["hourly", "daily", "weekly"]).default("daily"),
  syncEntities: z.array(z.string()).min(1, "At least one entity must be selected").default([]),
});

interface SyncHistory {
  id: number;
  timestamp: string;
  status: "success" | "failed" | "in_progress";
  entityType: string;
  recordsProcessed: number;
  errorMessage?: string;
}

type MicrosoftConfigFormValues = z.infer<typeof microsoftConfigSchema>;

export default function MicrosoftIntegration() {
  const [activeTab, setActiveTab] = useState("configuration");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Form for Microsoft configuration settings
  const form = useForm<MicrosoftConfigFormValues>({
    resolver: zodResolver(microsoftConfigSchema),
    defaultValues: {
      tenantId: "",
      clientId: "",
      clientSecret: "",
      sustainabilityManagerUrl: "",
      fabricWorkspaceUrl: "",
      syncEnabled: false,
      syncInterval: "daily",
      syncEntities: ["templates", "reports", "dataPoints"],
    },
  });
  
  // Query for fetching Microsoft configuration
  const { data: configData, isLoading: isConfigLoading } = useQuery({
    queryKey: ["/api/microsoft/config"],
    onSuccess: (data) => {
      if (data) {
        form.reset({
          ...data,
          // Ensure credentials are not displayed in the UI
          clientSecret: data.clientSecret ? "********" : "",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load Microsoft integration configuration",
        variant: "destructive",
      });
    },
  });
  
  // Query for fetching sync history
  const { data: syncHistory = [], isLoading: isSyncHistoryLoading } = useQuery({
    queryKey: ["/api/microsoft/sync-history"],
    enabled: activeTab === "sync-history",
  });
  
  // Mutation for saving Microsoft configuration
  const saveMicrosoftConfigMutation = useMutation({
    mutationFn: async (data: MicrosoftConfigFormValues) => {
      return await apiRequest({
        url: "/api/microsoft/config",
        method: "POST",
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/microsoft/config"] });
      toast({
        title: "Success",
        description: "Microsoft integration configuration saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save Microsoft integration configuration",
        variant: "destructive",
      });
    },
  });
  
  // Mutation for triggering manual sync
  const triggerSyncMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest({
        url: "/api/microsoft/sync",
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/microsoft/sync-history"] });
      toast({
        title: "Sync Initiated",
        description: "Data synchronization with Microsoft services has been initiated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initiate synchronization",
        variant: "destructive",
      });
    },
  });
  
  // Function to handle form submission
  const onSubmit = (data: MicrosoftConfigFormValues) => {
    // Don't send masked password unless changed
    if (data.clientSecret === "********" && configData?.clientSecret) {
      data.clientSecret = configData.clientSecret;
    }
    
    saveMicrosoftConfigMutation.mutate(data);
  };
  
  // Function to trigger manual sync
  const handleManualSync = () => {
    triggerSyncMutation.mutate();
  };
  
  // Function to test connection
  const testConnection = async () => {
    try {
      await apiRequest({
        url: "/api/microsoft/test-connection",
        method: "POST",
        data: form.getValues(),
      });
      
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Microsoft services",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Microsoft services. Please check your credentials and settings.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Microsoft Integrations</h1>
        <p className="text-muted-foreground">
          Configure integration with Microsoft Sustainability Manager and Fabric
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="data-mapping">Data Mapping</TabsTrigger>
          <TabsTrigger value="sync-history">Sync History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Microsoft Credentials & Connection Settings</CardTitle>
              <CardDescription>
                Configure your Microsoft tenant ID and credentials for Sustainability Manager and Fabric
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Microsoft Entra ID Configuration</h3>
                    <FormField
                      control={form.control}
                      name="tenantId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Microsoft Tenant ID</FormLabel>
                          <FormControl>
                            <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your Microsoft Entra ID tenant identifier
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Application (client) ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="clientSecret"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Secret</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Client secret value" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Service Endpoints</h3>
                    <FormField
                      control={form.control}
                      name="sustainabilityManagerUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Microsoft Sustainability Manager URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://org.sustainability.microsoft.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Your Sustainability Manager instance URL
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fabricWorkspaceUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Microsoft Fabric Workspace URL</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://app.fabric.microsoft.com/workspaces/xxxx" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Your Microsoft Fabric workspace URL for data synchronization
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Synchronization Settings</h3>
                    <FormField
                      control={form.control}
                      name="syncEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Automatic Synchronization</FormLabel>
                            <FormDescription>
                              Automatically sync data between ESG Accelo 360Hub and Microsoft services
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium mb-2">Sync Interval</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="hourly"
                              value="hourly"
                              checked={form.watch("syncInterval") === "hourly"}
                              onChange={() => form.setValue("syncInterval", "hourly")}
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="hourly" className="text-sm">Hourly</label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="daily"
                              value="daily"
                              checked={form.watch("syncInterval") === "daily"}
                              onChange={() => form.setValue("syncInterval", "daily")}
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="daily" className="text-sm">Daily</label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="weekly"
                              value="weekly"
                              checked={form.watch("syncInterval") === "weekly"}
                              onChange={() => form.setValue("syncInterval", "weekly")}
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="weekly" className="text-sm">Weekly</label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Data to Synchronize</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="templates"
                              checked={form.watch("syncEntities").includes("templates")}
                              onChange={(e) => {
                                const current = form.watch("syncEntities");
                                if (e.target.checked) {
                                  form.setValue("syncEntities", [...current, "templates"]);
                                } else {
                                  form.setValue("syncEntities", current.filter(item => item !== "templates"));
                                }
                              }}
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary rounded"
                            />
                            <label htmlFor="templates" className="text-sm">Templates</label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="reports"
                              checked={form.watch("syncEntities").includes("reports")}
                              onChange={(e) => {
                                const current = form.watch("syncEntities");
                                if (e.target.checked) {
                                  form.setValue("syncEntities", [...current, "reports"]);
                                } else {
                                  form.setValue("syncEntities", current.filter(item => item !== "reports"));
                                }
                              }}
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary rounded"
                            />
                            <label htmlFor="reports" className="text-sm">Reports</label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="dataPoints"
                              checked={form.watch("syncEntities").includes("dataPoints")}
                              onChange={(e) => {
                                const current = form.watch("syncEntities");
                                if (e.target.checked) {
                                  form.setValue("syncEntities", [...current, "dataPoints"]);
                                } else {
                                  form.setValue("syncEntities", current.filter(item => item !== "dataPoints"));
                                }
                              }}
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary rounded"
                            />
                            <label htmlFor="dataPoints" className="text-sm">Data Points</label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="standards"
                              checked={form.watch("syncEntities").includes("standards")}
                              onChange={(e) => {
                                const current = form.watch("syncEntities");
                                if (e.target.checked) {
                                  form.setValue("syncEntities", [...current, "standards"]);
                                } else {
                                  form.setValue("syncEntities", current.filter(item => item !== "standards"));
                                }
                              }}
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary rounded"
                            />
                            <label htmlFor="standards" className="text-sm">GRI Standards</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={testConnection}
                      disabled={saveMicrosoftConfigMutation.isPending}
                    >
                      Test Connection
                    </Button>
                    
                    <div className="space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={saveMicrosoftConfigMutation.isPending}
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        disabled={saveMicrosoftConfigMutation.isPending}
                      >
                        {saveMicrosoftConfigMutation.isPending ? "Saving..." : "Save Configuration"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data-mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping Configuration</CardTitle>
              <CardDescription>
                Configure how ESG Accelo 360Hub fields map to Microsoft Sustainability Manager fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="emissions">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="emissions">Emissions</TabsTrigger>
                  <TabsTrigger value="water">Water</TabsTrigger>
                  <TabsTrigger value="waste">Waste</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                </TabsList>
                
                <TabsContent value="emissions" className="space-y-4 pt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ESG Accelo 360Hub Field</TableHead>
                          <TableHead>Microsoft Field</TableHead>
                          <TableHead>Data Type</TableHead>
                          <TableHead>Transform</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>GRI 305-1 Direct Emissions</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>EmissionsFactorLibrary.ScopeOneEmissions</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-edit-line text-xs mr-1"></i> Edit
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric (tCO₂e)</TableCell>
                          <TableCell>None</TableCell>
                          <TableCell>
                            <Badge variant="success">Mapped</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>GRI 305-2 Indirect Emissions</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>EmissionsFactorLibrary.ScopeTwoEmissions</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-edit-line text-xs mr-1"></i> Edit
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric (tCO₂e)</TableCell>
                          <TableCell>None</TableCell>
                          <TableCell>
                            <Badge variant="success">Mapped</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>GRI 305-3 Other Indirect Emissions</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>EmissionsFactorLibrary.ScopeThreeEmissions</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-edit-line text-xs mr-1"></i> Edit
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric (tCO₂e)</TableCell>
                          <TableCell>None</TableCell>
                          <TableCell>
                            <Badge variant="success">Mapped</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Energy Consumption</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>ActivityData.EnergyConsumption</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-edit-line text-xs mr-1"></i> Edit
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric (MWh)</TableCell>
                          <TableCell>Unit Conversion</TableCell>
                          <TableCell>
                            <Badge variant="success">Mapped</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <i className="ri-add-line mr-1"></i> Add Mapping
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="water" className="space-y-4 pt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ESG Accelo 360Hub Field</TableHead>
                          <TableHead>Microsoft Field</TableHead>
                          <TableHead>Data Type</TableHead>
                          <TableHead>Transform</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>GRI 303-3 Water Withdrawal</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>WaterMetrics.Withdrawal</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-edit-line text-xs mr-1"></i> Edit
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric (m³)</TableCell>
                          <TableCell>None</TableCell>
                          <TableCell>
                            <Badge variant="success">Mapped</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>GRI 303-4 Water Discharge</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>WaterMetrics.Discharge</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-edit-line text-xs mr-1"></i> Edit
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric (m³)</TableCell>
                          <TableCell>None</TableCell>
                          <TableCell>
                            <Badge variant="success">Mapped</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>GRI 303-5 Water Consumption</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>WaterMetrics.Consumption</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-edit-line text-xs mr-1"></i> Edit
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric (m³)</TableCell>
                          <TableCell>None</TableCell>
                          <TableCell>
                            <Badge variant="success">Mapped</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="waste" className="pt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ESG Accelo 360Hub Field</TableHead>
                          <TableHead>Microsoft Field</TableHead>
                          <TableHead>Data Type</TableHead>
                          <TableHead>Transform</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>GRI 306-3 Waste Generated</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>WasteMetrics.Generated</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-edit-line text-xs mr-1"></i> Edit
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric (tonnes)</TableCell>
                          <TableCell>None</TableCell>
                          <TableCell>
                            <Badge variant="success">Mapped</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>GRI 306-4 Waste Diverted</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>WasteMetrics.Diverted</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-edit-line text-xs mr-1"></i> Edit
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric (tonnes)</TableCell>
                          <TableCell>None</TableCell>
                          <TableCell>
                            <Badge variant="success">Mapped</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>GRI 306-5 Waste to Disposal</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>WasteMetrics.Disposal</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-edit-line text-xs mr-1"></i> Edit
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric (tonnes)</TableCell>
                          <TableCell>None</TableCell>
                          <TableCell>
                            <Badge variant="success">Mapped</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="social" className="pt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ESG Accelo 360Hub Field</TableHead>
                          <TableHead>Microsoft Field</TableHead>
                          <TableHead>Data Type</TableHead>
                          <TableHead>Transform</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>GRI 401-1 New Employee Hires</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>Not Mapped</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-add-line text-xs mr-1"></i> Map
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric</TableCell>
                          <TableCell>N/A</TableCell>
                          <TableCell>
                            <Badge variant="outline">Not Mapped</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>GRI 405-1 Diversity Metrics</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>Not Mapped</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-add-line text-xs mr-1"></i> Map
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Percentage</TableCell>
                          <TableCell>N/A</TableCell>
                          <TableCell>
                            <Badge variant="outline">Not Mapped</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>GRI 403-9 Work-related Injuries</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>Not Mapped</span>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <i className="ri-add-line text-xs mr-1"></i> Map
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>Numeric</TableCell>
                          <TableCell>N/A</TableCell>
                          <TableCell>
                            <Badge variant="outline">Not Mapped</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Mapping Configuration</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="sync-history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Synchronization History</CardTitle>
                  <CardDescription>
                    View recent data synchronization activities with Microsoft services
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleManualSync}
                  disabled={triggerSyncMutation.isPending}
                >
                  <i className="ri-restart-line mr-1"></i>
                  {triggerSyncMutation.isPending ? "Syncing..." : "Sync Now"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isSyncHistoryLoading ? (
                <div className="flex justify-center py-8">
                  <p>Loading sync history...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Records Processed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                          No synchronization history found. Use the "Sync Now" button to start your first sync.
                        </TableCell>
                      </TableRow>
                    ) : (
                      syncHistory.map((record: SyncHistory) => (
                        <TableRow key={record.id}>
                          <TableCell>{new Date(record.timestamp).toLocaleString()}</TableCell>
                          <TableCell className="capitalize">{record.entityType}</TableCell>
                          <TableCell>{record.recordsProcessed}</TableCell>
                          <TableCell>
                            <Badge variant={
                              record.status === "success" ? "success" :
                              record.status === "in_progress" ? "outline" : "destructive"
                            }>
                              {record.status === "success" ? "Successful" :
                               record.status === "in_progress" ? "In Progress" : "Failed"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {record.status === "failed" && record.errorMessage ? (
                              <div className="flex items-center">
                                <Button variant="ghost" size="sm">
                                  <i className="ri-error-warning-line mr-1"></i> View Error
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" size="sm">
                                <i className="ri-file-list-line mr-1"></i> View Log
                              </Button>
                            )}
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
              <CardTitle>Sync Settings</CardTitle>
              <CardDescription>
                Configure automatic synchronization schedule and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Next Scheduled Sync</h4>
                  <div className="flex items-center space-x-2 text-lg">
                    <i className="ri-calendar-event-line text-primary"></i>
                    <span>Today, 11:00 PM</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Based on your daily sync schedule
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Sync Status</h4>
                  <div className="flex items-center">
                    <Badge variant="success" className="mr-2">Active</Badge>
                    <span>Automatic synchronization is enabled</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Templates, Reports, and Data Points will be synchronized
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-4">Advanced Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="conflict-resolution" />
                    <label htmlFor="conflict-resolution" className="text-sm">
                      Prefer Microsoft data in conflicts
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="delete-removed" />
                    <label htmlFor="delete-removed" className="text-sm">
                      Delete removed items
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sync-attachments" />
                    <label htmlFor="sync-attachments" className="text-sm">
                      Include file attachments
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sync-history" />
                    <label htmlFor="sync-history" className="text-sm">
                      Include historical data
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}