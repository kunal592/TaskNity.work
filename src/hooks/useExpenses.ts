import { useData } from './useData';
import type { Expense } from '@/types';
import { mutate } from 'swr';

export function useExpenses() {
  const { data, isLoading, isError } = useData<Expense>('/api/expenses');

  const setExpenses = (expenses: Expense[]) => {
    mutate('/api/expenses', expenses, false);
  };

  return {
    expenses: data,
    setExpenses,
    isLoading,
    isError,
  };
}
