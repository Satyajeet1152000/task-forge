"use client";

const TeamMemberCardSkeleton: React.FC = () => {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 p-4">
        <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-48 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-slate-100 px-2 py-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2 px-2">
            <div className="h-8 w-8 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </article>
  );
};

export default TeamMemberCardSkeleton;
