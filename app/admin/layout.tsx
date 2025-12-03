"use client";

import { FileText, Heart, Layers, LayoutDashboard, LogOut, Menu, Newspaper, Settings, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Sections",
    href: "/admin/sections",
    icon: Layers,
  },
  {
    title: "Content",
    href: "/admin/content",
    icon: FileText,
  },
  {
    title: "Press About Us",
    href: "/admin/press",
    icon: Newspaper,
  },
  {
    title: "Sponsors",
    href: "/admin/sponsors",
    icon: Users,
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: Heart,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo/Title */}
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
              <p className="text-sm text-muted-foreground mt-1">50 Years ULAW</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive && "bg-primary/10 text-primary hover:bg-primary/20",
                      )}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full justify-start gap-3" onClick={logout} disabled={isLoading}>
                <LogOut className="h-5 w-5" />
                {isLoading ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto p-6 lg:p-8 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
