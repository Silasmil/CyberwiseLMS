import { Link, useLocation } from "wouter";
import { Users, LayoutDashboard, BookOpen, FileText, Bell, LogOut, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUser, removeAuthToken } from "@/lib/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const user = getCurrentUser();

  const navigationItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/admin", testId: "nav-admin-dashboard" },
    { title: "Applications", icon: Users, url: "/admin/applications", testId: "nav-admin-applications" },
    { title: "Students", icon: Users, url: "/admin/students", testId: "nav-admin-students" },
    { title: "Courses", icon: BookOpen, url: "/admin/courses", testId: "nav-admin-courses" },
    { title: "Announcements", icon: Bell, url: "/admin/announcements", testId: "nav-admin-announcements" },
  ];

  const handleLogout = () => {
    removeAuthToken();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <Link href="/admin">
              <div className="flex items-center gap-2 cursor-pointer hover-elevate rounded-lg p-2">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <span className="font-heading font-bold text-lg">Cyberwise</span>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={location === item.url}
                        data-testid={item.testId}
                      >
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4 space-y-2">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user?.fullName ? getInitials(user.fullName) : "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={handleLogout} data-testid="button-admin-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-admin-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
