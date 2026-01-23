"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function NavUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="pointer-events-none">
          <Skeleton className="h-8 w-8 rounded-lg bg-border" />
          <div className="grid flex-1 gap-2 text-left">
            <Skeleton className="h-4 w-24 bg-border" />
            <Skeleton className="h-3 w-32 bg-border" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}