import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import NavLink from '../ui/NavLink';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Share To Earn', href: '/share' },
    { name: 'Be a Validator', href: '/Validator' },
    { name: 'Sustainable Scanning', href: '/scan' },
    { name: 'Connect Wallet', href: '/Walletprofile' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                DataMesh
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                isActive={location.pathname === item.href}
              >
                {item.name}
              </NavLink>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                isActive={location.pathname === item.href}
                isMobile
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;