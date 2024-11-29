import React from 'react';
import { useQuery } from 'react-query';
import { Clock } from 'lucide-react';
import { fetchPendingValidations } from '../../api/dashboard';

function ValidationTasks() {
  const { data: tasks, isLoading } = useQuery('pendingValidations', fetchPendingValidations);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Validations</h2>
      <div className="space-y-4">
        {tasks?.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No pending validations
          </p>
        ) : (
          tasks?.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.merchant}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Amount: ${task.amount}
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                Validate
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ValidationTasks;