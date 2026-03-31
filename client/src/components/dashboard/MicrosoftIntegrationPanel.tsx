import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { syncWithMicrosoft } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
}

export default function MicrosoftIntegrationPanel() {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "fabric",
      name: "Microsoft Fabric",
      icon: "auto_awesome",
      connected: true,
    },
    {
      id: "sustainability",
      name: "Sustainability Manager",
      icon: "eco",
      connected: true,
    },
    {
      id: "datalake",
      name: "Microsoft Data Lake",
      icon: "storage",
      connected: false,
    },
  ]);

  const handleConnect = (id: string) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const connectedServices = integrations
        .filter((i) => i.connected)
        .map((i) => i.id);
      
      await syncWithMicrosoft(connectedServices);
      
      // Simulate a delay for the sync
      setTimeout(() => {
        setSyncing(false);
        toast({
          title: "Sync completed",
          description: "Data has been successfully synchronized with Microsoft services.",
        });
      }, 2000);
    } catch (error) {
      setSyncing(false);
      toast({
        title: "Sync failed",
        description: "Unable to sync with Microsoft services.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-l-4 border-accent">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium text-neutral-800">
          Microsoft Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center p-3 bg-neutral-50 rounded-md"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  integration.connected
                    ? "bg-accent bg-opacity-10"
                    : "bg-neutral-200"
                }`}
              >
                <span
                  className={`material-icons ${
                    integration.connected ? "text-accent" : "text-neutral-500"
                  }`}
                >
                  {integration.icon}
                </span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">{integration.name}</h3>
                <div className="flex items-center mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      integration.connected ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span className="text-xs text-neutral-500 ml-1">
                    {integration.connected ? "Connected" : "Not connected"}
                  </span>
                </div>
              </div>
              <Button
                variant="link"
                size="sm"
                className="ml-auto text-primary p-0"
                onClick={() => handleConnect(integration.id)}
              >
                {integration.connected ? "Configure" : "Connect"}
              </Button>
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-accent text-white hover:bg-accent/90 mt-5"
          onClick={handleSync}
          disabled={syncing}
        >
          <span className="material-icons mr-2">
            {syncing ? "hourglass_empty" : "sync"}
          </span>
          {syncing ? "Syncing..." : "Sync Data with Microsoft"}
        </Button>
      </CardContent>
    </Card>
  );
}
