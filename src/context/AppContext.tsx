'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import type { AppContextType, User, Project, Task, Attendance, Leave, Expense } from '@/types';
import { useProjects } from '@/hooks/useProjects';
import { useUsers } from '@/hooks/useUsers';
import { useTasks } from '@/hooks/useTasks';
import { useAttendance } from '@/hooks/useAttendance';
import { useLeaves } from '@/hooks/useLeaves';
import { useExpenses } from '@/hooks/useExpenses';

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { users, updateUser } = useUsers();
  const { projects, setProjects } = useProjects();
  const { tasks, setTasks } = useTasks();
  const { attendance, setAttendance } = useAttendance();
  const { leaves, setLeaves } = useLeaves();
  const { expenses, setExpenses } = useExpenses();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [expenseCategories] = useState<string[]>(["Food", "Travel", "Supplies"]); // Static for now

  useEffect(() => {
    // TODO: Replace with actual current user logic
    const userForRole = users.find(u => u.role === 'Member');
    setCurrentUser(userForRole || users[0] || null);
  }, [users]);

  const markAttendance = async (status: Attendance['status']) => {
    const today = new Date().toISOString().split('T')[0];
    if (!currentUser) return;

    const existingEntry = attendance.find(
      (a) => a.userId === currentUser.id && a.date === today
    );

    if (!existingEntry) {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.id, date: today, status }),
      });

      if (res.ok) {
        const newAttendance = await res.json();
        setAttendance([...attendance, newAttendance]);
      }
    }
  };

  const roleAccess = {
    canManageProjects: currentUser?.role === 'Admin',
    canManageTasks: currentUser ? ['Admin', 'Member'].includes(currentUser.role) : false,
    canViewAnalytics: currentUser ? ['Admin', 'Member', 'Viewer'].includes(currentUser.role) : false,
    canManageTeam: currentUser?.role === 'Admin',
    canMarkAttendance: currentUser ? ['Admin', 'Member'].includes(currentUser.role) : false,
    canManageExpenses: currentUser?.role === 'Admin',
  };

  const value: AppContextType = {
    currentUser,
    users,
    updateUser,
    projects,
    setProjects,
    tasks,
    setCurrentUser: (user: User | null) => setCurrentUser(user),
    setTasks,
    attendance,
    markAttendance,
    leaves,
    setLeaves,
    roleAccess,
    expenses,
    setExpenses,
    expenseCategories,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
