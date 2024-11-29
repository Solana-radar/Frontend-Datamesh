import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Wallet, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    {
      title: 'OCR Technology',
      description: 'Automatically extract data from your invoices with high accuracy',
      icon: FileText,
    },
    {
      title: 'Solana Integration',
      description: 'Secure and fast blockchain transactions for your earnings',
      icon: Wallet,
    },
    {
      title: 'USDi Earnings',
      description: 'Earn stable USDi tokens for every validated invoice',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Transform Your Invoices <br />
              Into <span className="text-blue-600">Instant Earnings</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            >
               Empowering communities to earn from invoice bills with Solana's stablecoin infrastructure.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/share"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
              >
                Get Started
                <ArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Powerful Features
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-600">100K+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Processed Invoices
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Users</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-600">$1M+</div>
              <div className="text-gray-600 dark:text-gray-300">
                USDi Distributed
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-blue-600">99.9%</div>
              <div className="text-gray-600 dark:text-gray-300">
                Accuracy Rate
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}