'use client';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

export default function AttendancePage() {
  const { markAttendance, attendance, currentUser } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todaysAttendance = currentUser && attendance?.find(a => a.userId === currentUser.id && a.date.startsWith(today));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Mark Your Attendance</h1>
      {todaysAttendance ? (
        <p className="text-xl">Your attendance for today is marked as: <strong>{todaysAttendance.status}</strong></p>
      ) : (
        <div className="space-x-4">
          <Button onClick={() => markAttendance('PRESENT')} size="lg">Clock In</Button>
          <Button onClick={() => markAttendance('ON_LEAVE')} size="lg" variant="secondary">On Leave</Button>
          <Button onClick={() => markAttendance('ABSENT')} size="lg" variant="destructive">Clock Out</Button>
        </div>
      )}
    </div>
  );
}
