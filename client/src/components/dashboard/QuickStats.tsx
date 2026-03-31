import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuickStats() {
  const stats = [
    {
      title: "Templates",
      value: "12",
      change: "+3",
      isPositive: true,
    },
    {
      title: "Data Completion",
      value: "78%",
      change: "+5%",
      isPositive: true,
    },
    {
      title: "Standards",
      value: "7",
      change: "",
      isPositive: false,
    },
    {
      title: "Data Quality",
      value: "92%",
      change: "+2%",
      isPositive: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium text-neutral-800">
          ESG Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="p-3 bg-neutral-50 rounded-md">
              <h3 className="text-xs text-neutral-500 uppercase">
                {stat.title}
              </h3>
              <div className="flex items-center mt-1">
                <span className="text-xl font-medium">{stat.value}</span>
                {stat.change ? (
                  <span
                    className={`ml-auto text-xs ${
                      stat.isPositive ? "text-green-500" : "text-neutral-500"
                    } flex items-center`}
                  >
                    {stat.isPositive && (
                      <span className="material-icons text-sm mr-0.5">
                        arrow_upward
                      </span>
                    )}
                    {stat.change}
                  </span>
                ) : (
                  <span className="ml-auto text-xs text-neutral-500">
                    No change
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="relative">
          <h3 className="text-sm font-medium mb-2">Data Ingestion Progress</h3>
          <div className="flex space-x-2 items-center">
            <Progress value={65} className="flex-1 h-2" />
            <span className="text-sm font-medium">65%</span>
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Next automated sync in 3 hours
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
