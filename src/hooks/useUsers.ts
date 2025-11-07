import { useData } from './useData';
import type { User } from '@/types';
import { mutate } from 'swr';

export function useUsers() {
  const { data, isLoading, isError } = useData<User>('/api/users');

  const updateUser = async (user: User) => {
    const res = await fetch(`/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      const updatedData = data.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      mutate('/api/users', updatedData, false);
    }
  };

  return {
    users: data,
    updateUser,
    isLoading,
    isError,
  };
}
