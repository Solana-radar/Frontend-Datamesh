import React from 'react';
import { useQuery } from 'react-query';
import { Upload, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import EarningsChart from '../components/dashboard/EarningsChart';
import ValidationTasks from '../components/dashboard/ValidationTasks';
import { fetchDashboardStats } from '../api/dashboard';

function Dashboard() {
  const { data: stats, isLoading } = useQuery('dashboardStats', fetchDashboardStats);

  const statsCards = [
    {
      title: 'Uploaded Invoices',
      value: stats?.totalUploads || 0,
      icon: Upload,
      color: 'blue',
    },
    {
      title: 'Pending Validation',
      value: stats?.pendingValidations || 0,
      icon: Clock,
      color: 'yellow',
    },
    {
      title: 'Validated',
      value: stats?.validated || 0,
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Rejected',
      value: stats?.rejected || 0,
      icon: AlertCircle,
      color: 'red',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EarningsChart />
        <ValidationTasks />
      </div>

      <RecentActivity />
    </div>
  );
}

export default Dashboard;