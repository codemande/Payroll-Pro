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
        {/* Logo Section */}
        <div className="sidebar-header">
          {/* <div className="sidebar-logo-box">
            <Receipt className="sidebar-logo-icon" size={16} />
          </div> */}
          <img src="/payroll-logo-transparent.svg" alt="payroll logo" className="sidebar-logo"/>
          <span className="sidebar-logo-text font-display">
            PayrollPro
          </span>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-link ${isActive ? "active" : "inactive"}`}
              >
                <item.icon className="sidebar-nav-icon" size={16} />
                {item.label}
                {isActive && (
                  <ChevronRight className="sidebar-nav-chevron" size={16} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="sidebar-footer">
          <div className="sidebar-user-email">
            {user?.email}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="sidebar-logout-btn"
          >
            <LogOut className="sidebar-logout-icon" size={16} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="main-content-inner animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}