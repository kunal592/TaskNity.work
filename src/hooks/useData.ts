import useSWR from 'swr';
import { useSession } from '@clerk/nextjs';

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

export function useData<T>(endpoint: string, fallbackData: T[] = []) {
  const { session } = useSession();
  const { data, error } = useSWR<T[]>(endpoint, (url) => apiFetcher(url, session));

  return {
    data: error ? fallbackData : data || [],
    isLoading: !error && !data,
    isError: error,
  };
}
