import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";

import "../styles/dashboard.css";

export default function DashboardPage() {
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get("/employees");
      return res.data;
    },
  });

  const { data: positions = [] } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const res = await api.get("/positions");
      return res.data;
    },
  });

  const totalMonthly = employees.reduce(
    (sum, e) => sum + Number(e.base_salary || 0),
    0
  );

  const totalYearly = totalMonthly * 13;

  const totalTax = employees.reduce(
    (sum, e) =>
      sum + (Number(e.base_salary || 0) * Number(e.tax_rate || 0)) / 100,
    0
  );

  const positionCounts = {};

  employees.forEach((emp) => {
    const pos = emp.position;
    const key = pos ? pos.title : "Unassigned";

    if (!positionCounts[key]) {
      positionCounts[key] = {
        title: key,
        department: pos?.department || "—",
        count: 0,
      };
    }

    positionCounts[key].count++;
  });

  const stats = [
    { label: "Total Employees", value: employees.length, icon: Users },
    { label: "Positions", value: positions.length, icon: Briefcase },
    {
      label: "Monthly Payroll",
      value: `$${totalMonthly.toLocaleString()}`,
      icon: DollarSign,
    },
    {
      label: "Yearly Payroll (13mo)",
      value: `$${totalYearly.toLocaleString()}`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Payroll overview and workforce summary</p>
      </div>

      <div className="dashboard-stats-grid">
        {stats.map((stat) => (
          <Card key={stat.label} className="dashboard-stat-card">
            <CardContent className="dashboard-stat-content">
              <div className="dashboard-stat-icon-box">
                <stat.icon className={`dashboard-stat-icon ${stat.color}`} />
              </div>
              <div className="dashboard-stat-details">
                <p className="dashboard-stat-label">{stat.label}</p>
                <p className="dashboard-stat-value">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role breakdown */}
      <Card className="dashboard-role-card">
        <CardHeader>
          <CardTitle className="dashboard-card-title">Employee Roles & Headcount</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.values(positionCounts).length === 0 ? (
            <p className="dashboard-empty-msg">No employees yet. Add employees to see the breakdown.</p>
          ) : (
            <div className="dashboard-role-list">
              {Object.values(positionCounts).map((pos) => (
                <div key={pos.title} className="dashboard-role-item">
                  <div className="dashboard-role-info">
                    <p className="dashboard-role-title">{pos.title}</p>
                    <p className="dashboard-role-dept">{pos.department}</p>
                  </div>
                  <span className="dashboard-role-badge">
                    {pos.count} {pos.count === 1 ? "employee" : "employees"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly tax summary */}
      <Card className="dashboard-tax-card">
        <CardHeader>
          <CardTitle className="dashboard-card-title">Tax Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="dashboard-tax-grid">
            <div className="dashboard-tax-box">
              <p className="dashboard-tax-label">Monthly Tax Obligations</p>
              <p className="dashboard-tax-value">${totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="dashboard-tax-box">
              <p className="dashboard-tax-label">Yearly Tax Obligations (13mo)</p>
              <p className="dashboard-tax-value">${(totalTax * 13).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}