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
import { ArrowLeft, Plus, Pencil } from "lucide-react";

import { toast } from "sonner"; 
import "../styles/employee-detail.css";

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

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await api.get(`/employees/${id}`);
      return res.data;
    },
  });

  const { data: deductions = [] } = useQuery({
    queryKey: ["employee-deductions", id],
    queryFn: async () => {
      const res = await api.get(`/employees/${id}/deductions`);
      return res.data;
    },
  });

  const { data: salaryHistory = [] } = useQuery({
    queryKey: ["salary-history", id],
    queryFn: async () => {
      const res = await api.get(`/employees/${id}/salary-history`);
      return res.data;
    },
  });

  const { data: deductionTypes = [] } = useQuery({
    queryKey: ["deduction-types"],
    queryFn: async () => {
      const res = await api.get(`/deduction-types`);
      return res.data;
    },
  });

  const changeSalary = useMutation({
    mutationFn: async () => {
      if (!employee) return;
      const salary = parseFloat(newSalary);
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
    return <p className="employee-detail-loading">Loading...</p>;
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
    <div className="employee-detail-page">
      <Button variant="ghost" className="employee-detail-back-btn" onClick={() => navigate("/employees")}>
        <ArrowLeft size={16} /> Back to Employees
      </Button>

      <div className="employee-detail-header">
        <div>
          <h1 className="employee-detail-name font-display">
            {employee.first_name} {employee.last_name}
          </h1>
          <p className="employee-detail-info">
            #{employee.employee_number} · {employee.position?.title || "No position"} · {employee.position?.department || ""}
          </p>
        </div>
        <span className={`employee-detail-status ${employee.is_active ? "active" : "inactive"}`}>
          {employee.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="employee-detail-grid">
        <Card className="employee-detail-card-border">
          <CardHeader className="employee-detail-card-header-flex">
            <CardTitle className="employee-detail-card-title">Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="employee-detail-card-content">
            <Row label="Gross Salary" value={monthlySalary} />
            <Row label={`Tax (${employee.tax_rate}%)`} value={-monthlyTax} negative />
            {activeDeductions.map((d) => (
              <Row key={d._id} label={`${d.deduction_type?.name} (${d.percentage}%)`} value={-(monthlySalary * Number(d.percentage)) / 100} negative />
            ))}
            <div className="employee-detail-net-wrapper">
              <Row label="Net Salary" value={monthlyNet} bold />
            </div>
          </CardContent>
        </Card>

        <Card className="employee-detail-card-border">
          <CardHeader>
            <CardTitle className="employee-detail-card-title">Yearly Breakdown (13 Months)</CardTitle>
          </CardHeader>
          <CardContent className="employee-detail-card-content">
            <Row label="Gross Salary" value={yearlySalary} />
            <Row label="Total Tax" value={-yearlyTax} negative />
            <Row label="Total Deductions" value={-yearlyDeductions} negative />
            <div className="employee-detail-net-wrapper">
              <Row label="Net Salary" value={yearlyNet} bold />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="employee-detail-grid management">
        {/* Change salary */}
        <Card className="employee-detail-card-border">
          <CardHeader className="employee-detail-card-header-flex">
            <CardTitle className="employee-detail-card-title">Salary History</CardTitle>
            <Dialog open={salaryDialogOpen} onOpenChange={setSalaryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="employee-detail-action-btn">
                  <Pencil size={14} /> Change Salary
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Change Salary</DialogTitle></DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); changeSalary.mutate(); }} className="employee-detail-form">
                  <div>
                    <Label>Current Salary</Label>
                    <p className="employee-detail-current-salary">${monthlySalary.toLocaleString()}</p>
                  </div>
                  <div className="employee-detail-form-spacing">
                    <Label>New Monthly Salary</Label>
                    <Input type="number" step="0.01" value={newSalary} onChange={(e) => setNewSalary(e.target.value)} required />
                  </div>
                  <div className="employee-detail-form-spacing">
                    <Label>Reason (optional)</Label>
                    <Input value={salaryReason} onChange={(e) => setSalaryReason(e.target.value)} />
                  </div>
                  <Button type="submit" className="employee-detail-submit-btn" disabled={changeSalary.isPending}>
                    Update Salary
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {salaryHistory.length === 0 ? (
              <p className="employee-detail-empty">No salary changes recorded.</p>
            ) : (
              <div className="employee-detail-list">
                {salaryHistory.map((h) => (
                  <div key={h._id} className="employee-detail-list-item">
                    <div>
                      <p className="employee-detail-list-main">${Number(h.previous_salary).toLocaleString()} → ${Number(h.new_salary).toLocaleString()}</p>
                      <p className="employee-detail-subtext">{h.reason || "No reason"}</p>
                    </div>
                    <span className="employee-detail-subtext">{new Date(h.effective_date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deductions */}
        <Card className="employee-detail-card-border">
          <CardHeader className="employee-detail-card-header-flex">
            <CardTitle className="employee-detail-card-title">Deductions</CardTitle>
            <Dialog open={deductionDialogOpen} onOpenChange={setDeductionDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="employee-detail-action-btn">
                  <Plus size={14} /> Add Deduction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Deduction</DialogTitle></DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); addDeduction.mutate(); }} className="employee-detail-form">
                  <div className="employee-detail-form-spacing">
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
                  <div className="employee-detail-form-spacing">
                    <Label>Percentage (%)</Label>
                    <Input type="number" step="0.01" value={deductionForm.percentage} onChange={(e) => setDeductionForm({ ...deductionForm, percentage: e.target.value })} required />
                  </div>
                  <div className="employee-detail-form-spacing">
                    <Label>Start Date</Label>
                    <Input type="date" value={deductionForm.start_date} onChange={(e) => setDeductionForm({ ...deductionForm, start_date: e.target.value })} required />
                  </div>
                  <div className="employee-detail-form-spacing">
                    <Label>End Date (optional)</Label>
                    <Input type="date" value={deductionForm.end_date} onChange={(e) => setDeductionForm({ ...deductionForm, end_date: e.target.value })} />
                  </div>
                  <Button type="submit" className="employee-detail-submit-btn" disabled={addDeduction.isPending}>
                    Add Deduction
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {deductions.length === 0 ? (
              <p className="employee-detail-empty">No deductions active.</p>
            ) : (
              <div className="employee-detail-list">
                {deductions.map((d) => (
                  <div key={d._id} className="employee-detail-list-item">
                    <div>
                      <p className="employee-detail-item-name">{d.deduction_type?.name}</p>
                      <p className="employee-detail-subtext">
                        {d.start_date} {d.end_date ? `→ ${d.end_date}` : "(ongoing)"}
                      </p>
                    </div>
                    <div className="employee-detail-item-right">
                      <p className="employee-detail-item-name">{d.percentage}%</p>
                      <span className={`employee-detail-status-small ${d.is_active ? "active" : "ended"}`}>
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
    <div className="employee-detail-row">
      <span className={`employee-detail-row-label ${bold ? "bold" : "muted"}`}>
        {label}
      </span>
      <span className={`employee-detail-row-value ${bold ? "bold" : "medium"} ${negative ? "negative" : "primary"}`}>
        {negative ? "−" : ""}${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
}