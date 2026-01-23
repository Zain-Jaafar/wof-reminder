import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DashboardSquare02Icon,
  Calendar03Icon,
  Settings05Icon,
} from "@/lib/icons";
import { Icon } from "@/components/ui/icon";

// Menu items.
const items = [
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
  {
    title: "Settings",
    url: "#",
    icon: Settings05Icon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
