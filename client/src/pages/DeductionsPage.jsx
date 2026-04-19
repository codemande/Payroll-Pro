import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
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
    default_percentage: "",
  });

  const { data: deductionTypes = [] } = useQuery({
    queryKey: ["deduction-types"],
    queryFn: async () => {
      const res = await api.get("/deductions");
      return res.data;
    },
  });

  const addType = useMutation({
    mutationFn: async () => {
      await api.post("/deductions", {
        name: form.name,
        description: form.description || null,
        default_percentage: parseFloat(form.default_percentage) || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deduction-types"] });
      setDialogOpen(false);
      setForm({ name: "", description: "", default_percentage: "" });
      toast.success("Deduction type added");
    },
    onError: (err) =>
      toast.error(err.message || "Failed to add deduction type"),
  });

  return (
    <div className="deductions-page">
      <div className="deductions-header">
        <div>
          <h1 className="page-title">Deduction Types</h1>
          <p className="page-subtitle">
            Manage housing, pension, insurance and other deductions
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="add-btn">
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
              className="form"
            >
              <div>
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

              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Brief description"
                />
              </div>

              <div>
                <Label>Default Percentage (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.default_percentage}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      default_percentage: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <Button type="submit" disabled={addType.isPending}>
                Add Deduction Type
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {deductionTypes.length === 0 ? (
        <Card className="empty-card">
          <CardContent className="empty-content">
            No deduction types yet. Add types like Housing, Pension, or Insurance.
          </CardContent>
        </Card>
      ) : (
        <div className="grid">
          {deductionTypes.map((dt) => (
            <Card key={dt._id} className="deduction-card">
              <CardContent className="card-content">
                <div className="card-top">
                  <div>
                    <h3 className="deduction-name">{dt.name}</h3>
                    {dt.description && (
                      <p className="deduction-desc">{dt.description}</p>
                    )}
                  </div>

                  <span
                    className={`status ${
                      dt.is_active !== false ? "active" : "inactive"
                    }`}
                  >
                    {dt.is_active !== false ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="rate-box">
                  <p className="rate-label">Default Rate</p>
                  <p className="rate-value">{dt.default_percentage}%</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}