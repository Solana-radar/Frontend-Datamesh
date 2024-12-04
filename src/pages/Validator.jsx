import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Use this for React Router
import { fetchValidationTasks } from '../api/validate';

function Validator() {
    const [currentTask, setCurrentTask] = useState(null);
    const { data: tasks, isLoading } = useQuery('validationTasks', fetchValidationTasks);
    const navigate = useNavigate(); // Use this for navigation

    const handleValidate = (decision) => {
        // Handle validation decision
        setCurrentTask(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Go to Dashboard Button */}
            <div className="text-right">
                <button
                    onClick={() => navigate('/dashboard')} // Update this path as per your routing setup
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900"
                >
                    Go to Dashboard
                </button>
            </div>

            {/* Validation Portal Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Validation Portal</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Help validate invoices and earn rewards
                </p>
            </div>

            {currentTask ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Original Invoice</h3>
                            <img
                                src={currentTask.imageUrl}
                                alt="Invoice"
                                className="w-full rounded-lg"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Extracted Data</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Merchant
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {currentTask.merchant}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Amount
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        ${currentTask.amount}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Date
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {new Date(currentTask.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Category
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {currentTask.category}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 space-x-4">
                                <button
                                    onClick={() => handleValidate('approve')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleValidate('reject')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                >
                                    <XCircle className="mr-2 h-5 w-5" />
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks?.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {task.merchant}
                                </h3>
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Amount: ${task.amount}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Date: {new Date(task.date).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setCurrentTask(task)}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Start Validation
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Validator;
