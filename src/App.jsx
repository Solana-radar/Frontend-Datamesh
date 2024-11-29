import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Share from './pages/Share';
import Dashboard from './pages/dashboard';
import Validator from './pages/Validator';
import SmartReceipts from './pages/scan';
import ConnectWallet from './pages/Walletprofile';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
               <Route index element={<Home />} />
               <Route path="dashboard" element={<Dashboard />} />
               <Route path="Validator" element={<Validator />} />
               <Route path="share" element={<Share />} />
               <Route path="Walletprofile" element={<ConnectWallet />} />
               <Route path="scan" element={<SmartReceipts />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;