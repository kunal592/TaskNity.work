import { useData } from './useData';
import type { Task } from '@/types';
import { mutate } from 'swr';

export function useTasks() {
  const { data, isLoading, isError } = useData<Task>('/api/tasks');

  const setTasks = (tasks: Task[]) => {
    mutate('/api/tasks', tasks, false);
  };

  return {
    tasks: data,
    setTasks,
    isLoading,
    isError,
  };
}
