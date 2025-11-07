"use client";
import useLeaderboard from '@/hooks/useLeaderboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LeaderboardProps {
  onUserClick: (userId: string) => void;
}

export default function Leaderboard({ onUserClick }: LeaderboardProps) {
  const { leaderboard, isLoading } = useLeaderboard();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">🏆 Top Contributors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Using a list for semantic correctness, even though it's inside a CardContent */}
          <ul className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <li key={i} className="flex items-center gap-3">
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">🏆 Top Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {leaderboard.map((user: any) => (
            <li
              key={user.id}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onUserClick(user.id)}
            >
              <span className="font-bold text-lg w-6 text-center">
                {user.rank === 1 ? <Crown className="w-5 h-5 text-yellow-500" /> : user.rank}
              </span>
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map((n:string) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="font-medium text-sm hover:underline">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.completedTasks} tasks completed</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
