"use client";

import { Icon } from "@iconify/react";

const TeamMemberEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <Icon icon="fluent:people-team-24-regular" className="mb-4 h-12 w-12 text-slate-300" />
      <h3 className="text-lg font-semibold text-slate-900">No team members yet</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Invite colleagues to your team to assign tasks and track their progress here.
      </p>
    </div>
  );
};

export default TeamMemberEmptyState;
