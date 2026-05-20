"use client";

import { Icon } from "@iconify/react";
import { NAV_ITEMS, Routes } from "@task-forge/shared/constant";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/modules/auth/auth.actions";
import { useAuth } from "@/modules/auth/use-auth";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SideNavBar(): React.ReactElement {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await logoutAction();
    } finally {
      await signOut({ redirect: false });
    }
    toast.success("Logged out successfully");
    router.push(Routes.LOGIN);
    router.refresh();
  };

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-card">
      <div className="flex flex-col items-center border-b px-4 py-6">
        <Avatar className="size-20">
          <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
          <AvatarFallback className="text-base font-medium">
            {user?.name ? getInitials(user.name) : "U"}
          </AvatarFallback>
        </Avatar>
        <p className="mt-3 text-sm font-semibold text-foreground">{user?.name ?? "User"}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{user?.email ?? ""}</p>
      </div>
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 py-4 pl-2">
        {NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon icon={item.icon} className="h-5 w-5 shrink-0" aria-hidden />
              {item.label}
              {isActive ? (
                <span className="absolute bottom-0 right-0 top-0 w-1 rounded-full bg-primary" />
              ) : null}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="relative flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium   transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Icon icon="material-symbols:logout-rounded" className="h-5 w-5 shrink-0" aria-hidden />
          Logout
        </button>
      </nav>
    </aside>
  );
}
