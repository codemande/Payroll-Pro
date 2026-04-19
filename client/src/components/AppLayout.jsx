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
import "../styles/layout.css";

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
    <div className="layout-container">

      {/* Sidebar */}
      <aside className="sidebar">

        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo-box">
            <Receipt className="sidebar-logo-icon" />
          </div>

          <span className="sidebar-logo-text">
            PayrollPro
          </span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-link ${isActive ? "active" : ""}`}
              >
                <item.icon className="sidebar-nav-icon" />
                {item.label}

                {isActive && (
                  <ChevronRight className="sidebar-nav-chevron" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer (user + logout) */}
        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            {user?.email}
          </div>

          <Button
            onClick={signOut}
            className="sidebar-logout-btn"
          >
            <LogOut className="sidebar-logout-icon" />
            Sign Out
          </Button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-content-inner">
          {children}
        </div>
      </main>

    </div>
  );
}