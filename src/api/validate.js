// Simulated API calls for validation tasks
export const fetchValidationTasks = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return Array.from({ length: 6 }, (_, i) => ({
      id: `task-${i + 1}`,
      merchant: `Merchant ${i + 1}`,
      amount: Math.floor(Math.random() * 1000) + 100,
      date: new Date().toISOString(),
      category: ['Food & Dining', 'Transportation', 'Utilities', 'Office Supplies'][
        Math.floor(Math.random() * 4)
      ],
      imageUrl: 'https://via.placeholder.com/400x600',
    }));
  };