"use client";

import { useEffect, useState } from "react";

export default function HomePage(): React.ReactElement {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Task Forge
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Task Forge</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Task Forge is a task management system that allows you to manage your tasks and projects.
        </p>
      </div>
    </main>
  );
}
