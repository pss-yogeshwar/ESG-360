import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { demoUser } from "@/lib/constants";

export default function Settings() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [anomalyAlerts, setAnomalyAlerts] = useState(true);
  const [reportGenerationAlerts, setReportGenerationAlerts] = useState(true);
  const [dataIngestionAlerts, setDataIngestionAlerts] = useState(true);
  
  const handleSaveMicrosoftSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Microsoft integration settings have been saved successfully",
    });
  };
  
  const handleSaveNotificationSettings = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated",
    });
  };
  
  const handleTestConnection = () => {
    toast({
      title: "Connection Successful",
      description: "Successfully connected to Microsoft Sustainability Manager",
    });
  };
  
  const handleResetSettings = () => {
    setApiKey("");
    setTenantId("");
    setClientId("");
    setClientSecret("");
    
    toast({
      title: "Settings Reset",
      description: "All integration settings have been reset",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            Configure your ESG Accelo 360Hub settings and integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="microsoft">
            <TabsList className="mb-4">
              <TabsTrigger value="microsoft">Microsoft Integration</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="microsoft">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Microsoft Sustainability Manager API Key
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Azure Tenant ID
                  </label>
                  <Input
                    placeholder="Enter Azure Tenant ID"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client ID
                  </label>
                  <Input
                    placeholder="Enter Client ID"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Secret
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter Client Secret"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button onClick={handleSaveMicrosoftSettings} className="bg-primary hover:bg-primary-dark">
                    Save Settings
                  </Button>
                  <Button onClick={handleTestConnection} variant="outline">
                    Test Connection
                  </Button>
                  <Button onClick={handleResetSettings} variant="destructive">
                    Reset
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-gray-800">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive important alerts via email</p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-gray-800">Anomaly Detection Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified when anomalies are detected</p>
                  </div>
                  <Switch 
                    checked={anomalyAlerts} 
                    onCheckedChange={setAnomalyAlerts} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-gray-800">Report Generation Notifications</h3>
                    <p className="text-sm text-gray-500">Get alerted when reports are generated</p>
                  </div>
                  <Switch 
                    checked={reportGenerationAlerts} 
                    onCheckedChange={setReportGenerationAlerts} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-gray-800">Data Ingestion Status</h3>
                    <p className="text-sm text-gray-500">Receive alerts about data ingestion status</p>
                  </div>
                  <Switch 
                    checked={dataIngestionAlerts} 
                    onCheckedChange={setDataIngestionAlerts} 
                  />
                </div>
                
                <Button onClick={handleSaveNotificationSettings} className="bg-primary hover:bg-primary-dark">
                  Save Notification Settings
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="account">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    className="w-16 h-16 rounded-full"
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                    alt="User"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{demoUser.fullName}</h3>
                    <p className="text-sm text-gray-500">{demoUser.role}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    placeholder="Enter your full name"
                    defaultValue={demoUser.fullName}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    defaultValue="john.smith@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <Input
                    disabled
                    value={demoUser.role}
                  />
                  <p className="text-xs text-gray-500 mt-1">Contact an administrator to change your role</p>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-primary hover:bg-primary-dark">
                    Save Account Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Application Version</h3>
              <p className="text-lg font-semibold text-gray-900">1.0.0</p>
            </div>
            
            <div className="border p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Last Updated</h3>
              <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="border p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700">Database Status</h3>
              <p className="text-lg font-semibold text-green-600">Connected</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">
            ESG Accelo 360Hub is developed and maintained by SOFTECH360.
            For support, contact support@softech360.com
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
