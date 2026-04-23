import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../services/api";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Search, Eye } from "lucide-react";
import { toast } from "sonner";

import "../styles/employees.css";

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    employeeNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    baseSalary: "",
    taxRate: "",
    hireDate: new Date().toISOString().split("T")[0],
  });

  const { data: employees = [], isLoading } = useQuery({
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

  const addEmployee = useMutation({
    mutationFn: async () => {
      await api.post("/employees", {
        ...form,
        baseSalary: Number(form.baseSalary),
        taxRate: Number(form.taxRate),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setDialogOpen(false);
      setForm({ 
        employeeNumber: "", 
        firstName: "", 
        lastName: "", 
        email: "", 
        phone: "", 
        position: "", 
        baseSalary: "", 
        taxRate: "", 
        hireDate: new Date().toISOString().split("T")[0] 
      });
      toast.success("Employee added successfully");
    },
    onError: (err) => toast.error(err.message),
  });

  const filtered = employees.filter((e) =>
    `${e.firstName} ${e.lastName} ${e.employeeNumber} ${e.position?.title}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="employees-container">
      <div className="employees-header">
        <div>
          <h1 className="employees-title font-display">Employees</h1>
          <p className="employees-subtitle">{employees.length} total employees</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="employees-add-btn">
              <Plus size={16} /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="employees-dialog">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addEmployee.mutate();
              }}
              className="employees-form-grid"
            >
              <div className="employees-form-item">
                <Label>Employee #</Label>
                <Input value={form.employeeNumber} onChange={(e) => setForm({ ...form, employeeNumber: e.target.value })} required />
              </div>
              <div className="employees-form-item">
                <Label>Hire Date</Label>
                <Input type="date" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} required />
              </div>
              <div className="employees-form-item">
                <Label>First Name</Label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              </div>
              <div className="employees-form-item">
                <Label>Last Name</Label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
              </div>
              <div className="employees-form-item">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="employees-form-item">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="employees-form-item">
                <Label>Position</Label>
                <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
                  <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                  <SelectContent>
                    {positions.map((p) => (
                      <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="employees-form-item">
                <Label>Base Salary (Monthly)</Label>
                <Input type="number" step="0.01" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} required />
              </div>
              <div className="employees-form-item col-span-2">
                <Label>Tax Rate (%)</Label>
                <Input type="number" step="0.01" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} required />
              </div>
              <div className="col-span-2">
                <Button type="submit" className="employees-submit-btn" disabled={addEmployee.isPending}>
                  {addEmployee.isPending ? "Adding..." : "Add Employee"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="employees-search-wrapper">
        <Search className="employees-search-icon" size={16} />
        <Input
          placeholder="Search by name, number, or position..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="employees-search-input"
        />
      </div>

      {isLoading ? (
        <p className="employees-loading">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card className="employees-empty-card">
          <CardContent className="employees-empty-content">
            {search ? "No employees match your search." : "No employees yet. Add your first employee to get started."}
          </CardContent>
        </Card>
      ) : (
        <div className="employees-table-container">
          <table className="employees-table">
            <thead>
              <tr className="employees-table-header-row">
                <th className="employees-th text-left">Employee</th>
                <th className="employees-th text-left">Position</th>
                <th className="employees-th text-right">Monthly Salary</th>
                <th className="employees-th text-right">Tax Rate</th>
                <th className="employees-th text-center">Status</th>
                <th className="employees-th text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp._id} className="employees-table-row">
                  <td className="employees-td">
                    <div>
                      <p className="employees-name-text">{emp.firstName} {emp.lastName}</p>
                      <p className="employees-number-text">#{emp.employeeNumber}</p>
                    </div>
                  </td>
                  <td className="employees-td text-foreground">
                    {emp.position?.title || <span className="employees-muted-text">—</span>}
                  </td>
                  <td className="employees-td text-right font-medium text-foreground">
                    ${Number(emp.baseSalary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="employees-td text-right text-foreground">{emp.taxRate}%</td>
                  <td className="employees-td text-center">
                    <span className={`employees-status-badge ${emp.isActive ? "active" : "inactive"}`}>
                      {emp.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="employees-td text-center">
                    <Link to={`/employees/${emp._id}`}>
                      <Button variant="ghost" size="sm" className="employees-view-btn">
                        <Eye size={16} /> View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}