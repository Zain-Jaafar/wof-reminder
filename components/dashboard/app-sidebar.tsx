"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/sidebar/nav-user";
import { NavUserSkeleton } from "@/components/sidebar/nav-user-skeleton";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import {
  DashboardSquare02Icon,
  Calendar03Icon,
} from "@/lib/icons";
import { Icon } from "@/components/ui/icon";
import { useQuery, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { api } from "@/convex/_generated/api";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: DashboardSquare02Icon,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar03Icon,
  },
];

export function AppSidebar() {
  const user = useQuery(api.vehicles.getCurrentUser);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const userObject = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: user?.image,
  };

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <Icon icon={item.icon} strokeWidth={1.5} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <AuthLoading>
            <NavUserSkeleton />
          </AuthLoading>
          <Authenticated>
            <NavUser user={userObject} onSettingsClick={() => setIsSettingsOpen(true)} />
          </Authenticated>
          <Unauthenticated>
            {null}
          </Unauthenticated>
        </SidebarFooter>
      </Sidebar>
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        initialName={user?.name || ""}
      />
    </>
  );
}
