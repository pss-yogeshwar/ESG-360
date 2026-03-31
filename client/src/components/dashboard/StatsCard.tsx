import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  changePercentage?: number;
  changeText?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconBgColor,
  changePercentage,
  changeText = "from last month",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <i className={`${icon} text-xl text-primary`}></i>
        </div>
      </div>
      {changePercentage !== undefined && (
        <div className="mt-2 flex items-center">
          <span
            className={`text-sm font-medium flex items-center ${
              changePercentage >= 0 ? "text-success" : "text-error"
            }`}
          >
            <i
              className={`${
                changePercentage >= 0 ? "ri-arrow-up-line" : "ri-arrow-down-line"
              } mr-1`}
            ></i>
            {Math.abs(changePercentage)}%
          </span>
          <span className="text-xs text-gray-500 ml-2">{changeText}</span>
        </div>
      )}
    </div>
  );
}
