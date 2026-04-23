import { useState } from "react";
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
import { Textarea } from "../components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import "../styles/deductions.css";

export default function DeductionsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    defaultPercentage: "",
  });

  const { data: deductionTypes = [] } = useQuery({
    queryKey: ["deduction-types"],
    queryFn: async () => {
      const res = await api.get("/deduction-types");
      return res.data;
    },
  });

  const addType = useMutation({
    mutationFn: async () => {
      await api.post("/deduction-types", {
        name: form.name,
        description: form.description || null,
        defaultPercentage: parseFloat(form.defaultPercentage) || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deduction-types"] });
      setDialogOpen(false);
      setForm({ name: "", description: "", defaultPercentage: "" });
      toast.success("Deduction type added");
    },
    onError: (err) =>
      toast.error(err.message || "Failed to add deduction type"),
  });

  return (
    <div className="deductions-container">
      <div className="deductions-header">
        <div>
          <h1 className="deductions-title font-display">Deduction Types</h1>
          <p className="deductions-subtitle">
            Manage housing, pension, insurance and other deductions
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="deductions-add-btn">
              <Plus size={16} /> Add Deduction Type
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Deduction Type</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addType.mutate();
              }}
              className="deductions-form"
            >
              <div className="deductions-form-item">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Housing, Pension"
                  required
                />
              </div>

              <div className="deductions-form-item">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Brief description"
                />
              </div>

              <div className="deductions-form-item">
                <Label>Default Percentage (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.defaultPercentage}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      defaultPercentage: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <Button type="submit" className="deductions-submit-btn" disabled={addType.isPending}>
                Add Deduction Type
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {deductionTypes.length === 0 ? (
        <Card className="deductions-empty-card">
          <CardContent className="deductions-empty-content">
            No deduction types yet. Add types like Housing, Pension, or Insurance.
          </CardContent>
        </Card>
      ) : (
        <div className="deductions-grid">
          {deductionTypes.map((dt) => (
            <Card key={dt._id} className="deduction-card">
              <CardContent className="deduction-card-content">
                <div className="deduction-card-top">
                  <div>
                    <h3 className="deduction-name">{dt.name}</h3>
                    {dt.description && (
                      <p className="deduction-desc">{dt.description}</p>
                    )}
                  </div>

                  <span
                    className={`deduction-status-badge ${
                      dt.isActive !== false ? "active" : "inactive"
                    }`}
                  >
                    {dt.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="deduction-rate-box">
                  <p className="deduction-rate-label">Default Rate</p>
                  <p className="deduction-rate-value">{dt.defaultPercentage}%</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}