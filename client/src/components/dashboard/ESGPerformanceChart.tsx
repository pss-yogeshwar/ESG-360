import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Demo data - in a real app, this would come from an API
const chartData = [
  {
    month: "Jan",
    environmental: 72,
    social: 65,
    governance: 78,
  },
  {
    month: "Feb",
    environmental: 75,
    social: 68,
    governance: 79,
  },
  {
    month: "Mar",
    environmental: 78,
    social: 70,
    governance: 80,
  },
  {
    month: "Apr",
    environmental: 74,
    social: 72,
    governance: 81,
  },
  {
    month: "May",
    environmental: 80,
    social: 75,
    governance: 82,
  },
  {
    month: "Jun",
    environmental: 83,
    social: 78,
    governance: 83,
  },
];

type Period = "Monthly" | "Quarterly" | "Yearly";

export default function ESGPerformanceChart() {
  const [period, setPeriod] = useState<Period>("Monthly");

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-5 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">ESG Performance Metrics</h3>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-xs font-medium ${
              period === "Monthly"
                ? "bg-neutral rounded-md text-primary"
                : "text-gray-500 hover:bg-neutral rounded-md"
            }`}
            onClick={() => setPeriod("Monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium ${
              period === "Quarterly"
                ? "bg-neutral rounded-md text-primary"
                : "text-gray-500 hover:bg-neutral rounded-md"
            }`}
            onClick={() => setPeriod("Quarterly")}
          >
            Quarterly
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium ${
              period === "Yearly"
                ? "bg-neutral rounded-md text-primary"
                : "text-gray-500 hover:bg-neutral rounded-md"
            }`}
            onClick={() => setPeriod("Yearly")}
          >
            Yearly
          </button>
        </div>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="environmental"
              name="Environmental"
              stackId="1"
              stroke="#4CAF50"
              fill="#4CAF5033"
            />
            <Area
              type="monotone"
              dataKey="social"
              name="Social"
              stackId="2"
              stroke="#0D7184"
              fill="#0D718433"
            />
            <Area
              type="monotone"
              dataKey="governance"
              name="Governance"
              stackId="3"
              stroke="#FFC045"
              fill="#FFC04533"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
