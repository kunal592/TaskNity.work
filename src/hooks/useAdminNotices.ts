"use client";
import useSWR, { mutate } from 'swr';
import { useSession } from '@clerk/nextjs';
import { useCallback } from 'react';
import type { Notice } from '@/store/mockNotices';

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

export default function useAdminNotices() {
  const { session } = useSession();
  const { data: notices, error } = useSWR<Notice[]>('/api/notices', (url) => apiFetcher(url, session));

  const addNotice = async (notice: Omit<Notice, 'id'>) => {
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await session?.getToken()}`,
        },
        body: JSON.stringify(notice),
      });

      if (!res.ok) {
        throw new Error('Failed to add notice');
      }

      mutate('/api/notices');
    } catch (e) {
      console.error(e);
    }
  };

  const updateNotice = async (id: number, feedback: string) => {
    try {
      const res = await fetch(`/api/notices/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await session?.getToken()}`,
          },
          body: JSON.stringify({ feedback }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to update notice');
      }

      mutate('/api/notices');
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNotice = async (id: number) => {
    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await session?.getToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete notice');
      }

      mutate('/api/notices');
    } catch (e) {
      console.error(e);
    }
  };

  return {
    notices: error ? [] : notices,
    addNotice,
    updateNotice,
    deleteNotice,
    isLoading: !notices && !error,
  };
}
