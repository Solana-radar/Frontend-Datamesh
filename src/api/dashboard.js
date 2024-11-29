// Simulated API calls
export const fetchDashboardStats = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      totalUploads: 156,
      pendingValidations: 23,
      validated: 128,
      rejected: 5,
    };
  };
  
  export const fetchEarningsHistory = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      amount: Math.floor(Math.random() * 1000) + 500,
    })).reverse();
  };
  
  export const fetchPendingValidations = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return Array.from({ length: 5 }, (_, i) => ({
      id: `task-${i + 1}`,
      merchant: `Merchant ${i + 1}`,
      amount: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date().toISOString(),
    }));
  };
  
  export const fetchRecentActivity = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const statuses = ['validated', 'pending', 'rejected'];
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: `activity-${i + 1}`,
      description: `Invoice #${1000 + i} from Merchant ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
    }));
  };