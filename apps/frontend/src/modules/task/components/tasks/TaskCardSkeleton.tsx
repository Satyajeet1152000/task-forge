"use client";

const TaskCardSkeleton: React.FC = () => {
  return (
    <div className="flex overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="w-1 shrink-0 animate-pulse bg-slate-200" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-2 w-full animate-pulse rounded-full bg-slate-200" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 animate-pulse rounded bg-slate-100" />
          <div className="h-10 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="flex justify-between">
          <div className="flex -space-x-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
            <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCardSkeleton;
