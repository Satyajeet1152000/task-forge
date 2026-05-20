"use client";

import { Card, CardContent } from "@/components/ui/card";

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardContent className="p-6">
          <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="rounded-2xl border-slate-100 shadow-sm">
            <CardContent className="p-6">
              <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
              <div className="mt-6 h-[280px] animate-pulse rounded-xl bg-slate-100" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardContent className="p-6">
          <div className="h-6 w-36 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-10 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSkeleton;
