"use client";

import Image from "next/image";

export function Header(): React.ReactElement {
  return (
    <header className="flex h-16 shrink-0 items-center border-b px-4">
      <Image
        src="/logo/tf-logo-light.png"
        alt="Task Forge"
        width={100}
        height={20}
        className="h-7 w-auto"
        priority
      />
    </header>
  );
}
