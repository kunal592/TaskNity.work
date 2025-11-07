import { useData } from './useData';
import type { Project } from '@/types';
import { mutate } from 'swr';

export function useProjects() {
  const { data, isLoading, isError } = useData<Project>('/api/projects');

  const setProjects = (projects: Project[]) => {
    mutate('/api/projects', projects, false);
  };

  return {
    projects: data,
    setProjects,
    isLoading,
    isError,
  };
}
