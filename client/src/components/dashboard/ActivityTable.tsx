import { useQuery } from "@tanstack/react-query";

// Activity type from server response
interface Activity {
  id: number;
  activity: string;
  description: string;
  userId: number | null;
  timestamp: string;
  status: "completed" | "pending" | "failed" | "needs_review";
}

// Function to get icon based on activity type
const getActivityIcon = (activity: string) => {
  if (activity.includes("Template")) return "ri-file-list-3-line text-primary";
  if (activity.includes("Anomaly")) return "ri-error-warning-line text-error";
  if (activity.includes("Data Ingestion")) return "ri-upload-cloud-2-line text-secondary";
  if (activity.includes("Report")) return "ri-bar-chart-box-line text-primary-dark";
  return "ri-file-list-3-line text-primary";
};

// Function to get icon background color
const getIconBgColor = (activity: string) => {
  if (activity.includes("Template")) return "bg-blue-50";
  if (activity.includes("Anomaly")) return "bg-red-50";
  if (activity.includes("Data Ingestion")) return "bg-green-50";
  if (activity.includes("Report")) return "bg-purple-50";
  return "bg-blue-50";
};

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
  
  if (isToday) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (isYesterday) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

export default function ActivityTable() {
  // Fetch recent activity logs
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['/api/activity-logs/recent'],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500">Loading recent activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <p className="text-red-500">Error loading activity data</p>
      </div>
    );
  }

  // If no activities yet, show empty state
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500">No recent activities found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {activities.map((activity: Activity) => (
            <tr key={activity.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-8 w-8 ${getIconBgColor(activity.activity)} rounded-md flex items-center justify-center`}>
                    <i className={getActivityIcon(activity.activity)}></i>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{activity.activity}</div>
                    <div className="text-sm text-gray-500">{activity.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {activity.userId ? "John Smith" : "AI System"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatDate(activity.timestamp)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  activity.status === "completed" ? "bg-green-100 text-green-800" :
                  activity.status === "needs_review" ? "bg-yellow-100 text-yellow-800" :
                  activity.status === "failed" ? "bg-red-100 text-red-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('_', ' ')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
