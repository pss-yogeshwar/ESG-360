import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { detectAnomalies } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

interface Anomaly {
  id: string;
  title: string;
  description: string;
}

export default function AnomalyDetectionPanel() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: "1",
      title: "GHG Emissions Data",
      description: "Unusual spike in Scope 2 emissions detected for Q2 2023.",
    },
    {
      id: "2",
      title: "Water Consumption Data",
      description: "Missing data points for South Asia region in June 2023.",
    },
  ]);

  const handleRunScan = async () => {
    setLoading(true);
    try {
      // In a real application, this would be a specific dataset ID
      const result = await detectAnomalies("latest");
      
      // In a real application, we would use the actual response
      // For this demo we'll just use the existing data
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Anomaly scan completed",
          description: "Found existing anomalies in the dataset.",
        });
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Scan failed",
        description: "Unable to complete anomaly detection scan.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-xl font-medium text-neutral-800">
          Data Anomaly Detection
        </CardTitle>
        <Button variant="ghost" size="icon">
          <span className="material-icons text-neutral-500">more_vert</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="p-3 bg-neutral-50 rounded-md mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Last Scan</h3>
            <span className="text-xs text-neutral-500">Today, 09:45 AM</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="material-icons text-yellow-500 mr-1">
                error_outline
              </span>
              <span className="text-sm">{anomalies.length} Anomalies Detected</span>
            </div>
            <Button variant="link" size="sm" className="text-xs p-0 h-auto">
              View Details
            </Button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {anomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className="p-3 border border-yellow-200 bg-yellow-50 rounded-md"
            >
              <div className="flex">
                <span className="material-icons text-yellow-500 mr-2">
                  warning
                </span>
                <div>
                  <h4 className="text-sm font-medium">{anomaly.title}</h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    {anomaly.description}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                  Investigate
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary-light hover:bg-opacity-10"
          onClick={handleRunScan}
          disabled={loading}
        >
          <span className="material-icons mr-2">
            {loading ? "hourglass_empty" : "find_in_page"}
          </span>
          {loading ? "Running scan..." : "Run New Anomaly Scan"}
        </Button>
      </CardContent>
    </Card>
  );
}
