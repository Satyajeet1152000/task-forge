"use client";

import type { DashboardTaskCounts } from "../dashboard.utils";
import { formatDashboardDate, getTimeGreeting } from "../dashboard.utils";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardGreetingCardProps {
  userName: string;
  counts: DashboardTaskCounts;
}

interface StatItemProps {
  value: number;
  label: string;
  indicatorClass: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, indicatorClass }) => {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("h-10 w-1.5 shrink-0 rounded-full", indicatorClass)} />
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
};

const DashboardGreetingCard: React.FC<DashboardGreetingCardProps> = ({ userName, counts }) => {
  const greeting = getTimeGreeting();
  const displayName = userName.trim() || "there";

  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {greeting}! {displayName}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{formatDashboardDate()}</p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <StatItem value={counts.total} label="Total Tasks" indicatorClass="bg-blue-500" />
            <StatItem value={counts.pending} label="Pending Tasks" indicatorClass="bg-purple-500" />
            <StatItem
              value={counts.inProgress}
              label="In Progress"
              indicatorClass="bg-cyan-500"
            />
            <StatItem
              value={counts.completed}
              label="Completed Tasks"
              indicatorClass="bg-green-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardGreetingCard;
