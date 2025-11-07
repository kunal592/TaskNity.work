"use client";
import useSWR from 'swr';
import { useSession } from '@clerk/nextjs';
import { useCallback } from 'react';

export interface Invoice {
  id: number;
  employee: string;
  amount: number;
  status: "paid" | "pending";
  date: string;
}

export interface Salary {
  id: number;
  employee: string;
  base: number;
  bonus: number;
  total: number;
  role: string;
  lastPromotion: string;
}

const mockInvoices: Invoice[] = [
  { id: 1, employee: "Kunal Daharwal", amount: 5000, status: "paid", date: "2025-11-01" },
  { id: 2, employee: "Riya Sharma", amount: 4500, status: "pending", date: "2025-11-02" },
];

const mockSalaries: Salary[] = [
  { id: 1, employee: "Kunal Daharwal", base: 4000, bonus: 1000, total: 5000, role: "Team Lead", lastPromotion: "2025-09-10" },
  { id: 2, employee: "Riya Sharma", base: 3500, bonus: 500, total: 4000, role: "Developer", lastPromotion: "2025-07-01" },
];

export default function useCompanyFinance() {
  const { session } = useSession();

  const fetcher = useCallback(async (url: string) => {
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
  }, [session]);

  const { data: invoices, error: invoicesError } = useSWR<Invoice[]>('/api/invoices', fetcher);
  const { data: salaries, error: salariesError } = useSWR<Salary[]>('/api/payroll', fetcher);

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    console.warn("addInvoice is not implemented with SWR");
  };
  
  const updateSalary = (id: number, updates: Partial<Salary>) => {
    console.warn("updateSalary is not implemented with SWR");
  };

  return {
    invoices: invoicesError ? mockInvoices : invoices,
    addInvoice,
    salaries: salariesError ? mockSalaries : salaries,
    updateSalary,
  };
}
