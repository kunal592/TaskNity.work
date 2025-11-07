'use client';
import useSWR from 'swr';
import { useSession } from '@clerk/nextjs';

const mockAnalyticsData = {
  expenseTotal: 3700,
  revenueTotal: 5000,
  growthRate: 15,
  growthHistory: [
    { name: 'Jan', Revenue: 4000, Expense: 2400 },
    { name: 'Feb', Revenue: 3000, Expense: 1398 },
    { name: 'Mar', Revenue: 2000, Expense: 9800 },
    { name: 'Apr', Revenue: 2780, Expense: 3908 },
    { name: 'May', Revenue: 1890, Expense: 4800 },
    { name: 'Jun', Revenue: 2390, Expense: 3800 },
  ],
};

const apiFetcher = async (url: string, session: any) => {
  if (!session) {
    throw new Error('No session');
  }

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${await session.getToken()}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch');
  }

  return res.json();
};

export default function useAnalytics() {
  const { session } = useSession();

  const { data, error } = useSWR('/api/analytics', (url) => apiFetcher(url, session));

  return {
    analyticsData: error ? mockAnalyticsData : data || mockAnalyticsData,
    isLoading: !data && !error,
  };
}
