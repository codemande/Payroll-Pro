import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowLeft, DollarSign, Plus, Pencil } from "lucide-react";

import { toast } from "sonner"; 

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [salaryDialogOpen, setSalaryDialogOpen] = useState(false);
  const [deductionDialogOpen, setDeductionDialogOpen] = useState(false);
  const [newSalary, setNewSalary] = useState("");
  const [salaryReason, setSalaryReason] = useState("");
  const [deductionForm, setDeductionForm] = useState({ 
    deduction_type_id: "", 
    percentage: "", 
    start_date: new Date().toISOString().split("T")[0], 
    end_date: "" 
  });

  // GET Employee Details
  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await api.get(`/employees/${id}`);
      return res.data;
    },
  });

  // GET Employee Deductions
  const { data: deductions = [] } = useQuery({
    queryKey: ["employee-deductions", id],
    queryFn: async () => {
      const res = await api.get(`/employees/${id}/deductions`);
      return res.data;
    },
  });

  // GET Salary History
  const { data: salaryHistory = [] } = useQuery({
    queryKey: ["salary-history", id],
    queryFn: async () => {
      const res = await api.get(`/employees/${id}/salary-history`);
      return res.data;
    },
  });

  // GET Available Deduction Types
  const { data: deductionTypes = [] } = useQuery({
    queryKey: ["deduction-types"],
    queryFn: async () => {
      const res = await api.get(`/deduction-types`);
      return res.data;
    },
  });

  // UPDATE Salary
  const changeSalary = useMutation({
    mutationFn: async () => {
      if (!employee) return;
      const salary = parseFloat(newSalary);
      
      // Sending update to Express backend
      await api.put(`/employees/${id}`, { 
        base_salary: salary,
        salary_reason: salaryReason || null 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
      queryClient.invalidateQueries({ queryKey: ["salary-history", id] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setSalaryDialogOpen(false);
      setNewSalary("");
      setSalaryReason("");
      toast.success("Salary updated");
    },
    onError: (err) => toast.error(err.message),
  });

  // ADD Deduction
  const addDeduction = useMutation({
    mutationFn: async () => {
      await api.post(`/employees/${id}/deductions`, {
        deduction_type_id: deductionForm.deduction_type_id,
        percentage: parseFloat(deductionForm.percentage),
        start_date: deductionForm.start_date,
        end_date: deductionForm.end_date || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-deductions", id] });
      setDeductionDialogOpen(false);
      setDeductionForm({ 
        deduction_type_id: "", 
        percentage: "", 
        start_date: new Date().toISOString().split("T")[0], 
        end_date: "" 
      });
      toast.success("Deduction added");
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading || !employee) {
    return <p style={{ color: "gray" }}>Loading...</p>;
  }

  const monthlySalary = Number(employee.base_salary);
  const monthlyTax = (monthlySalary * Number(employee.tax_rate)) / 100;
  const activeDeductions = deductions.filter((d) => d.is_active);
  const totalDeductionPct = activeDeductions.reduce((sum, d) => sum + Number(d.percentage), 0);
  const monthlyDeductions = (monthlySalary * totalDeductionPct) / 100;
  const monthlyNet = monthlySalary - monthlyTax - monthlyDeductions;
  
  const yearlySalary = monthlySalary * 13;
  const yearlyTax = monthlyTax * 13;
  const yearlyDeductions = monthlyDeductions * 13;
  const yearlyNet = monthlyNet * 13;

  return (
    <div>
      <Button variant="ghost" style={{ marginBottom: "1rem", display: "flex", gap: "8px" }} onClick={() => navigate("/employees")}>
        <ArrowLeft size={16} /> Back to Employees
      </Button>

      <div style={{ marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>
            {employee.first_name} {employee.last_name}
          </h1>
          <p style={{ marginTop: "0.25rem", color: "gray" }}>
            #{employee.employee_number} · {employee.position?.title || "No position"} · {employee.position?.department || ""}
          </p>
        </div>
        <span style={{ 
          padding: "4px 12px", 
          borderRadius: "9999px", 
          fontSize: "0.875rem", 
          fontWeight: "500",
          backgroundColor: employee.is_active ? "#dcfce7" : "#fee2e2",
          color: employee.is_active ? "#166534" : "#991b1b"
        }}>
          {employee.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Financial Summary */}
      <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Row label="Gross Salary" value={monthlySalary} />
            <Row label={`Tax (${employee.tax_rate}%)`} value={-monthlyTax} negative />
            {activeDeductions.map((d) => (
              <Row key={d._id} label={`${d.deduction_type?.name} (${d.percentage}%)`} value={-(monthlySalary * Number(d.percentage)) / 100} negative />
            ))}
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
              <Row label="Net Salary" value={monthlyNet} bold />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yearly Breakdown (13 Months)</CardTitle>
          </CardHeader>
          <CardContent style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Row label="Gross Salary" value={yearlySalary} />
            <Row label="Total Tax" value={-yearlyTax} negative />
            <Row label="Total Deductions" value={-yearlyDeductions} negative />
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
              <Row label="Net Salary" value={yearlyNet} bold />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary & Deductions management */}
      <div style={{ marginTop: "1.5rem", display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        
        {/* Change salary */}
        <Card>
          <CardHeader style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <CardTitle>Salary History</CardTitle>
            <Dialog open={salaryDialogOpen} onOpenChange={setSalaryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" style={{ display: "flex", gap: "6px" }}>
                  <Pencil size={14} /> Change Salary
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Change Salary</DialogTitle></DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); changeSalary.mutate(); }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <Label>Current Salary</Label>
                    <p style={{ fontSize: "1.125rem", fontWeight: "600" }}>${monthlySalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>New Monthly Salary</Label>
                    <Input type="number" step="0.01" value={newSalary} onChange={(e) => setNewSalary(e.target.value)} required />
                  </div>
                  <div>
                    <Label>Reason (optional)</Label>
                    <Input value={salaryReason} onChange={(e) => setSalaryReason(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={changeSalary.isPending}>
                    Update Salary
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {salaryHistory.length === 0 ? (
              <p style={{ color: "gray", fontSize: "0.875rem" }}>No salary changes recorded.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {salaryHistory.map((h) => (
                  <div key={h._id} style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#f3f4f6", padding: "8px 12px", borderRadius: "8px" }}>
                    <div>
                      <p>${Number(h.previous_salary).toLocaleString()} → ${Number(h.new_salary).toLocaleString()}</p>
                      <p style={{ fontSize: "0.75rem", color: "gray" }}>{h.reason || "No reason"}</p>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "gray" }}>{new Date(h.effective_date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deductions */}
        <Card>
          <CardHeader style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <CardTitle>Deductions</CardTitle>
            <Dialog open={deductionDialogOpen} onOpenChange={setDeductionDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" style={{ display: "flex", gap: "6px" }}>
                  <Plus size={14} /> Add Deduction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Deduction</DialogTitle></DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); addDeduction.mutate(); }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <Label>Deduction Type</Label>
                    <Select value={deductionForm.deduction_type_id} onValueChange={(v) => setDeductionForm({ ...deductionForm, deduction_type_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {deductionTypes.map((dt) => (
                          <SelectItem key={dt._id} value={dt._id}>{dt.name} ({dt.default_percentage}%)</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Percentage (%)</Label>
                    <Input type="number" step="0.01" value={deductionForm.percentage} onChange={(e) => setDeductionForm({ ...deductionForm, percentage: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input type="date" value={deductionForm.start_date} onChange={(e) => setDeductionForm({ ...deductionForm, start_date: e.target.value })} required />
                  </div>
                  <div>
                    <Label>End Date (optional)</Label>
                    <Input type="date" value={deductionForm.end_date} onChange={(e) => setDeductionForm({ ...deductionForm, end_date: e.target.value })} />
                  </div>
                  <Button type="submit" disabled={addDeduction.isPending}>
                    Add Deduction
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {deductions.length === 0 ? (
              <p style={{ color: "gray", fontSize: "0.875rem" }}>No deductions active.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {deductions.map((d) => (
                  <div key={d._id} style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#f3f4f6", padding: "8px 12px", borderRadius: "8px" }}>
                    <div>
                      <p style={{ fontWeight: "500" }}>{d.deduction_type?.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "gray" }}>
                        {d.start_date} {d.end_date ? `→ ${d.end_date}` : "(ongoing)"}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: "500" }}>{d.percentage}%</p>
                      <span style={{ fontSize: "0.75rem", color: d.is_active ? "#166534" : "gray" }}>
                        {d.is_active ? "Active" : "Ended"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


function Row({ label, value, negative, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "0.875rem", fontWeight: bold ? "600" : "normal", color: bold ? "inherit" : "gray" }}>
        {label}
      </span>
      <span style={{ 
        fontSize: bold ? "1.125rem" : "0.875rem", 
        fontWeight: bold ? "bold" : "500", 
        color: negative ? "#dc2626" : "inherit" 
      }}>
        {negative ? "−" : ""}${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
}