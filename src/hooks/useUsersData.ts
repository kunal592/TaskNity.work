"use client";
import useSWR from 'swr';
import { useSession } from '@clerk/nextjs';
import { useCallback } from 'react';

// Keep the original interfaces
export interface Task {
  id: number;
  title: string;
  status: "completed" | "in-progress" | "pending";
  date: string;
}

export interface User {
  id: number;
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
  tasks: Task[];
  growth: number;
}

// Mock data to be used as a fallback
const mockUsers: User[] = [
  {
    id: 1,
    name: "Kunal Daharwal",
    role: "Admin",
    email: "kunal@tasknity.work",
    joined: "2024-01-12",
    avatar: "https://i.pravatar.cc/150?img=1",
    tasks: [
      { id: 1, title: "Setup Database", status: "completed", date: "2025-10-15" },
      { id: 2, title: "Deploy to Vercel", status: "in-progress", date: "2025-11-02" },
    ],
    growth: 92,
    team: "Core",
    salary: 120000,
    phone: "123-456-7890",
    address: "123 Main St, Anytown USA",
  },
  {
    id: 2,
    name: "Riya Sharma",
    role: "Member",
    email: "riya@tasknity.work",
    joined: "2024-03-18",
    avatar: "https://i.pravatar.cc/150?img=2",
    tasks: [
      { id: 3, title: "Fix UI Bugs", status: "completed", date: "2025-11-01" },
      { id: 4, title: "Integrate Socket.io", status: "pending", date: "2025-11-03" },
    ],
    growth: 76,
    team: "Frontend",
    salary: 85000,
    phone: "123-456-7891",
    address: "456 Oak Ave, Anytown USA",
  },
   {
    id: 3,
    name: "Chloe Patel",
    role: "Viewer",
    email: "chloe@tasknity.work",
    joined: "2024-03-10",
    avatar: "https://i.pravatar.cc/150?img=3",
    tasks: [],
    growth: 0,
    team: "Design",
    salary: 60000,
    phone: "123-456-7892",
    address: "789 Pine Ln, Anytown USA",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Member",
    email: "david@tasknity.work",
    joined: "2024-01-20",
    avatar: "https://i.pravatar.cc/150?img=4",
    tasks: [],
    growth: 0,
    team: "Backend",
    salary: 95000,
    phone: "123-456-7893",
    address: "101 Maple Dr, Anytown USA",
  }
];

export default function useUsersData() {
  const { session } = useSession();

  const fetcher = useCallback(async (url: string) => {
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
  }, [session]);

  const { data: users, error } = useSWR<User[]>('/api/users', fetcher);

  const getUser = useCallback((id: number) => {
    const userList = error ? mockUsers : users;
    return userList?.find((u) => u.id === id);
  }, [users, error]);
  
  const addUser = (user: Omit<User, 'id' | 'tasks' | 'growth' | 'avatar'>) => {
    console.warn("addUser is not implemented with SWR");
  };

  const deleteUser = (id: number) => {
    console.warn("deleteUser is not implemented with SWR");
  };

  return {
    users: error ? mockUsers : users,
    getUser,
    addUser,
    deleteUser,
  };
}
