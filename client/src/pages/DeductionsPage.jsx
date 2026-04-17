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

export default function DeductionsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", default_percentage: "" });

  // GET Deduction Types
  const { data: deductionTypes = [] } = useQuery({
    queryKey: ["deduction-types"],
    queryFn: async () => {
      const res = await api.get("/deductions"); 
      return res.data;
    },
  });

  // ADD Deduction Type
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
    onError: (err) => toast.error(err.message || "Failed to add deduction type"),
  });

  return (
    <div>
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Deduction Types</h1>
          <p style={{ marginTop: "0.25rem", color: "gray" }}>Manage housing, pension, insurance and other deductions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ display: "flex", gap: "8px" }}>
              <Plus size={16} /> Add Deduction Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Deduction Type</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); addType.mutate(); }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Housing, Pension" required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
              </div>
              <div>
                <Label>Default Percentage (%)</Label>
                <Input type="number" step="0.01" value={form.default_percentage} onChange={(e) => setForm({ ...form, default_percentage: e.target.value })} required />
              </div>
              <Button type="submit" disabled={addType.isPending}>
                Add Deduction Type
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {deductionTypes.length === 0 ? (
        <Card style={{ borderStyle: "dashed" }}>
          <CardContent style={{ padding: "3rem 0", textAlign: "center", color: "gray" }}>
            No deduction types yet. Add types like Housing, Pension, or Insurance.
          </CardContent>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {deductionTypes.map((dt) => (
            <Card key={dt._id} style={{ transition: "box-shadow 0.2s" }}>
              <CardContent style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>{dt.name}</h3>
                    {dt.description && <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "gray" }}>{dt.description}</p>}
                  </div>
                  <span style={{ 
                    padding: "2px 10px", 
                    borderRadius: "9999px", 
                    fontSize: "0.75rem", 
                    fontWeight: "500",
                    backgroundColor: dt.is_active !== false ? "#dcfce7" : "#f3f4f6",
                    color: dt.is_active !== false ? "#166534" : "gray"
                  }}>
                    {dt.is_active !== false ? "Active" : "Inactive"}
                  </span>
                </div>
                <div style={{ marginTop: "0.75rem", borderRadius: "8px", backgroundColor: "#f3f4f6", padding: "8px 12px" }}>
                  <p style={{ fontSize: "0.875rem", color: "gray" }}>Default Rate</p>
                  <p style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{dt.default_percentage}%</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}