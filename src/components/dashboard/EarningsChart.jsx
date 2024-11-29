import React from 'react';
import { useQuery } from 'react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchEarningsHistory } from '../../api/dashboard';

function EarningsChart() {
  const { data: earnings, isLoading } = useQuery('earningsHistory', fetchEarningsHistory);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Earnings Overview</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={earnings}>
            <defs>
              <linearGradient id="colorUSDi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorUSDi)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EarningsChart;