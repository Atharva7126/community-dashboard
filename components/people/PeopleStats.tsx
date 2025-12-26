"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Trophy, 
  Activity, 
  TrendingUp, 
  Calendar,
  Star,
  GitCommit,
  Target,
  GitPullRequest
} from "lucide-react";

interface ContributorEntry {
  username: string;
  name: string | null;
  avatar_url: string;
  role: string;
  total_points: number;
  activity_breakdown: Record<string, { count: number; points: number }>;
  daily_activity: Array<{ date: string; count: number; points: number }>;
}

interface PeopleStatsProps {
  contributors: ContributorEntry[];
  onContributorClick?: (contributor: ContributorEntry) => void;
}

export function PeopleStats({ contributors, onContributorClick }: PeopleStatsProps) {
  // Calculate stats
  const totalContributors = contributors.length;
  const totalPoints = contributors.reduce((sum, c) => sum + (c.total_points || 0), 0);
  const averagePoints = totalContributors > 0 ? Math.round(totalPoints / totalContributors) : 0;
  
  // Role distribution
  const roleDistribution = contributors.reduce((acc, contributor) => {
    const role = contributor.role || 'Unknown';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topRoles = Object.entries(roleDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Activity stats
  const totalActivities = contributors.reduce((sum, c) => {
    return sum + Object.values(c.activity_breakdown || {}).reduce((actSum, act) => actSum + act.count, 0);
  }, 0);

  // Most active contributors (last 7 days)
  const topContributors = contributors
    .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
    .slice(0, 5);

  // Active days stats
  const activeDaysData = contributors.map(c => c.daily_activity?.length || 0);
  const totalActiveDays = activeDaysData.reduce((sum, days) => sum + days, 0);
  const averageActiveDays = totalContributors > 0 ? Math.round(totalActiveDays / totalContributors) : 0;

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentlyActive = contributors.filter(contributor => {
    const lastActivity = contributor.daily_activity?.find(day => 
      new Date(day.date) >= sevenDaysAgo
    );
    return !!lastActivity;
  }).length;

  // Calculate activity type distribution
  const activityTypes = contributors.reduce((acc, contributor) => {
    Object.entries(contributor.activity_breakdown || {}).forEach(([type, data]) => {
      if (!acc[type]) acc[type] = { count: 0, points: 0 };
      acc[type].count += data.count;
      acc[type].points += data.points;
    });
    return acc;
  }, {} as Record<string, { count: number; points: number }>);

  const topActivityTypes = Object.entries(activityTypes)
    .sort(([, a], [, b]) => b.points - a.points)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Contributors */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl shadow-sm">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Contributors</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalContributors}</p>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Active community</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Points */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl shadow-sm">
                <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{totalPoints.toLocaleString()}</p>
                <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80">Community effort</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Points */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl shadow-sm">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Points</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{averagePoints}</p>
                <p className="text-xs text-green-600/80 dark:text-green-400/80">Per contributor</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recently Active */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl shadow-sm">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active This Week</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{recentlyActive}</p>
                <p className="text-xs text-purple-600/80 dark:text-purple-400/80">{Math.round((recentlyActive/totalContributors)*100)}% of community</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Top Contributors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div 
                  key={contributor.username} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onContributorClick?.(contributor)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${{
                    0: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-md',
                    1: 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md',
                    2: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md'
                  }[index] || 'bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold'}`}>
                    {index + 1}
                  </div>
                  <img 
                    src={contributor.avatar_url} 
                    alt={contributor.name || contributor.username}
                    className="w-10 h-10 rounded-full ring-2 ring-primary/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {contributor.name || contributor.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{contributor.username} • {contributor.role}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="font-bold">
                      {contributor.total_points || 0} pts
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {contributor.daily_activity?.length || 0} active days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalActivities.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Activities</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{averageActiveDays}</div>
              <div className="text-sm text-muted-foreground">Avg Active Days</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{Math.round(totalActivities / totalContributors)}</div>
              <div className="text-sm text-muted-foreground">Avg Activities</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{Math.round((recentlyActive / totalContributors) * 100)}%</div>
              <div className="text-sm text-muted-foreground">Weekly Active Rate</div>
            </div>
          </div>

          {/* Top Activity Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topActivityTypes.map(([type, data]) => {
              const getActivityIcon = (activityType: string) => {
                const typeStr = activityType.toLowerCase();
                if (typeStr.includes('commit')) return <GitCommit className="w-4 h-4" />;
                if (typeStr.includes('pr') || typeStr.includes('pull')) return <GitPullRequest className="w-4 h-4" />;
                if (typeStr.includes('issue')) return <Activity className="w-4 h-4" />;
                return <Activity className="w-4 h-4" />;
              };

              return (
                <div key={type} className="p-3 border rounded-lg bg-gradient-to-br from-background to-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    {getActivityIcon(type)}
                    <span className="font-medium text-sm truncate">{type}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-primary">{data.count}</div>
                    <div className="text-xs text-muted-foreground">{data.points} total points</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}