import { useData } from './useData';
import type { Leave } from '@/types';
import { mutate } from 'swr';

export function useLeaves() {
  const { data, isLoading, isError } = useData<Leave>('/api/leaves');

  const setLeaves = (leaves: Leave[]) => {
    mutate('/api/leaves', leaves, false);
  };

  return {
    leaves: data,
    setLeaves,
    isLoading,
    isError,
  };
}
