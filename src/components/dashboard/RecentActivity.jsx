import React from 'react';
import { useQuery } from 'react-query';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { fetchRecentActivity } from '../../api/dashboard';

function RecentActivity() {
  const { data: activities, isLoading } = useQuery('recentActivity', fetchRecentActivity);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              {getStatusIcon(activity.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.timestamp}
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ${activity.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentActivity;