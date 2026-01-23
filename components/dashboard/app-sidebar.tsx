"use client";

import { useState } from "react";
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
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import {
  DashboardSquare02Icon,
  Calendar03Icon,
  Settings05Icon,
} from "@/lib/icons";
import { Icon } from "@/components/ui/icon";
import { useQuery } from "convex/react";
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

  if (!user) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <Icon icon={item.icon} strokeWidth={1.5} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  const userObject = {
    name: user.name || "User",
    email: user.email || "user@example.com",
    avatar: user.image,
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
                      <a href={item.url}>
                        <Icon icon={item.icon} strokeWidth={1.5} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setIsSettingsOpen(true)}>
                    <Icon icon={Settings05Icon} strokeWidth={1.5} />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={userObject} />
        </SidebarFooter>
      </Sidebar>
      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        initialName={user.name || ""}
      />
    </>
  );
}
