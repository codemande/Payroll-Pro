import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import api from "../services/api";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

import { Plus, Search, Eye } from "lucide-react";

export default function EmployeesPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    employee_number: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
    base_salary: "",
    tax_rate: "",
  });

  // GET employees
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get("/employees");
      return res.data;
    },
  });

  // ADD employee
  const addEmployee = useMutation({
    mutationFn: async () => {
      await api.post("/employees", {
        ...form,
        base_salary: Number(form.base_salary),
        tax_rate: Number(form.tax_rate),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });

      setForm({
        employee_number: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        position: "",
        base_salary: "",
        tax_rate: "",
      });

      alert("Employee added successfully");
    },

    onError: (err) => {
      alert(err.message);
    },
  });

  // search filter
  const filtered = employees.filter((e) =>
    `${e.first_name} ${e.last_name} ${e.employee_number}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Employees ({employees.length})</h1>

      {/* Add Employee */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Employee Number"
          value={form.employee_number}
          onChange={(e) =>
            setForm({ ...form, employee_number: e.target.value })
          }
        />

        <input
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) =>
            setForm({ ...form, first_name: e.target.value })
          }
        />

        <input
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) =>
            setForm({ ...form, last_name: e.target.value })
          }
        />

        <input
          placeholder="Salary"
          value={form.base_salary}
          onChange={(e) =>
            setForm({ ...form, base_salary: e.target.value })
          }
        />

        <button onClick={() => addEmployee.mutate()}>
          Add Employee
        </button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent>No employees found</CardContent>
        </Card>
      ) : (
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Salary</th>
              <th>Tax</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((emp) => (
              <tr key={emp._id}>
                <td>
                  {emp.first_name} {emp.last_name}
                </td>

                <td>{emp.base_salary}</td>

                <td>{emp.tax_rate}%</td>

                <td>
                  <Link to={`/employees/${emp._id}`}>
                    <Button>
                      <Eye /> View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}