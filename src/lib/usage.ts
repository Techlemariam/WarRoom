"use client";

// Logic for calculating usage and reset times

export type ModelUsage = {
  name: string;
  used: number;
  quota: number;
  resetTime: string;
  percentage: number;
};

export type AccountUsage = {
  email: string;
  models: ModelUsage[];
};

// Initial state with default accounts
const DEFAULT_ACCOUNTS: AccountUsage[] = [
  {
    email: "alexander.teklemariam@gmail.com",
    models: [
      { name: "Gemini Flash", used: 600000, quota: 1000000, resetTime: "4h 2m", percentage: 60 },
      { name: "Gemini Pro", used: 0, quota: 1000000, resetTime: "13h 21m", percentage: 0 },
      { name: "Claude", used: 0, quota: 1000000, resetTime: "13h 0m", percentage: 0 },
    ]
  },
  {
    email: "isa.ljungdahl@gmail.com",
    models: [
      { name: "Gemini Flash", used: 150000, quota: 1000000, resetTime: "8h 15m", percentage: 15 },
      { name: "Gemini Pro", used: 45000, quota: 1000000, resetTime: "5h 10m", percentage: 4.5 },
      { name: "Claude", used: 890000, quota: 1000000, resetTime: "1h 45m", percentage: 89 },
    ]
  }
];

/**
 * Calculates the time remaining until Midnight Pacific Time (PT)
 * RPD (Requests Per Day) usually reset at PT.
 */
export function getResetTimePT(): string {
  const now = new Date();
  
  // Convert current time to Pacific Time (UTC-7 or UTC-8)
  const ptString = now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const ptDate = new Date(ptString);
  
  // Target: Midnight of the next day in PT
  const midnight = new Date(ptDate);
  midnight.setHours(24, 0, 0, 0);
  
  const diffMs = midnight.getTime() - ptDate.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

/**
 * Mock function to simulate fetching usage data.
 * In a real scenario, this would call GCP Monitoring or a local database.
 */
export async function getLiveUsage(): Promise<AccountUsage[]> {
  // We'll use localStorage to persist added accounts in the dashboard
  const saved = typeof window !== 'undefined' ? localStorage.getItem("war-room-accounts") : null;
  const accounts: AccountUsage[] = saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  
  // Update reset times dynamically
  const time = getResetTimePT();
  
  return accounts.map(acc => ({
    ...acc,
    models: acc.models.map(m => ({
      ...m,
      resetTime: time // For this mock, all daily quotas reset at the same time
    }))
  }));
}

export function addAccount(email: string) {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem("war-room-accounts");
    const accounts: AccountUsage[] = saved ? JSON.parse(saved) : [...DEFAULT_ACCOUNTS];
    
    if (accounts.find(a => a.email === email)) return;
    
    accounts.push({
      email,
      models: [
        { name: "Gemini Flash", used: 0, quota: 1000000, resetTime: "12h 0m", percentage: 0 },
        { name: "Gemini Pro", used: 0, quota: 1000000, resetTime: "12h 0m", percentage: 0 },
        { name: "Claude", used: 0, quota: 1000000, resetTime: "12h 0m", percentage: 0 },
      ]
    });
    
    localStorage.setItem("war-room-accounts", JSON.stringify(accounts));
}
