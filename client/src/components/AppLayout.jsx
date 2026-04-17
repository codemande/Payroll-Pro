import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import {
  LayoutDashboard,
  Users,
  Briefcase,
  Receipt,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { Button } from "../components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Employees", icon: Users, path: "/employees" },
  { label: "Positions", icon: Briefcase, path: "/positions" },
  { label: "Deductions", icon: Receipt, path: "/deductions" },
];

export default function AppLayout({ children }) {
  const { signOut, user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">

        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Receipt className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>

          <span className="text-lg font-bold text-sidebar-primary">
            PayrollPro
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}

                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer (user + logout) */}
        <div className="border-t p-4">
          <div className="mb-3 text-xs">
            {user?.email}
          </div>

          <Button
            onClick={signOut}
            className="w-full flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>

    </div>
  );
}