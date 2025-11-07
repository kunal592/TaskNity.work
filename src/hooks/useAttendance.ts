import { useData } from './useData';
import type { Attendance } from '@/types';
import { mutate } from 'swr';

export function useAttendance() {
  const { data, isLoading, isError } = useData<Attendance>('/api/attendance');

  const setAttendance = (attendance: Attendance[]) => {
    mutate('/api/attendance', attendance, false);
  };

  return {
    attendance: data,
    setAttendance,
    isLoading,
    isError,
  };
}
