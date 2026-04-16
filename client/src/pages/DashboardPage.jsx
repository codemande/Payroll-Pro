import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";

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
    <div>
      <h1>Dashboard</h1>

      <div>
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <stat.icon />
              <p>{stat.label}</p>
              <p>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Roles & Headcount</CardTitle>
        </CardHeader>

        <CardContent>
          {Object.values(positionCounts).map((pos) => (
            <div key={pos.title}>
              <p>{pos.title}</p>
              <p>{pos.department}</p>
              <span>{pos.count} employees</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <div>
            <p>Monthly Tax</p>
            <p>
              $
              {totalTax.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div>
            <p>Yearly Tax</p>
            <p>
              $
              {(totalTax * 13).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}