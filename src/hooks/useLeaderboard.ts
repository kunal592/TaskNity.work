"use client";
import useSWR from 'swr';
import { apiFetcher } from '@/lib/fetcher';

export default function useLeaderboard() {
  const { data, error } = useSWR('/api/users/leaderboard', apiFetcher);

  return {
    leaderboard: data || [],
    isLoading: !data && !error,
    error,
  };
}
