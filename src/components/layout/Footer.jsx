import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              DataMesh
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
            A DePIN solution that enhances Solana's stablecoin infrastructure, allowing users to earn stablecoin rewards by submitting and managing their invoice bills.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} DataMesh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;