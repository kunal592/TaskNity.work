"use client";
import useSWR from 'swr';
import { useCallback } from 'react';
import { apiFetcher } from '@/lib/fetcher';

export interface User {
  id: string;
  name: string;
  role: "Admin" | "Member" | "Viewer";
  email: string;
  phone?: string;
  address?: string;
  team?: string;
  salary?: number;
  github?: string;
  linkedin?: string;
  joined: string;
  avatar: string;
  tasks: any[];
  growth: number;
}

export default function useTeamManagement() {
  const { data: users, error, mutate } = useSWR<User[]>('/api/users', apiFetcher);

  const updateUser = useCallback(async (id: string, updates: Partial<User>) => {
    await apiFetcher(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    mutate();
  }, [mutate]);

  const addUser = useCallback(async (newUser: Omit<User, 'id' | 'tasks' | 'growth' | 'avatar'>) => {
    await apiFetcher('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });
    mutate();
  }, [mutate]);

  const deleteUser = useCallback(async (id: string) => {
    await apiFetcher(`/api/users/${id}`, { method: 'DELETE' });
    mutate();
  }, [mutate]);

  return {
    users: users || [],
    isLoading: !users && !error,
    error,
    updateUser,
    addUser,
    deleteUser,
  };
}
