"use client";
import useSWR from 'swr';
import { useSession } from '@clerk/nextjs';
import type { Expense, Invoice } from '@/types';

const mockExpenses: Expense[] = [
    { id: 1, title: "Office Rent", dept: "Admin", date: "2025-10-01", amount: 2000, status: "Approved" },
    { id: 2, title: "Team Outing", dept: "HR", date: "2025-10-10", amount: 500, status: "Pending" },
    { id: 3, title: "Software License", dept: "IT", date: "2025-10-15", amount: 1200, status: "Approved" },
];

const mockInvoices: Invoice[] = [
    { id: 1, client: "ABC Corp", date: "2025-10-05", amount: 5000, status: "Paid" },
    { id: 2, client: "XZY Pvt Ltd", date: "2025-10-20", amount: 3000, status: "Pending" },
];

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

export default function useFinance() {
  const { session } = useSession();

  const { data: expenses, error: expensesError } = useSWR<Expense[]>('/api/expenses', (url) => apiFetcher(url, session));
  const { data: invoices, error: invoicesError } = useSWR<Invoice[]>('/api/invoices', (url) => apiFetcher(url, session));

  return { 
    expenses: expensesError ? mockExpenses : expenses || [],
    invoices: invoicesError ? mockInvoices : invoices || [],
  };
}
