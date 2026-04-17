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
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function PositionsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", department: "" });

  // GET Positions
  const { data: positions = [] } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const res = await api.get("/positions");
      return res.data;
    },
  });

  // GET Employees 
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get("/employees");
      return res.data.filter(e => e.is_active !== false); 
    },
  });

  // ADD Position
  const addPosition = useMutation({
    mutationFn: async () => {
      await api.post("/positions", {
        title: form.title,
        department: form.department || "General",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      setDialogOpen(false);
      setForm({ title: "", department: "" });
      toast.success("Position added");
    },
    onError: (err) => toast.error(err.message || "Failed to add position"),
  });

  const countForPosition = (posId) => employees.filter((e) => {
      const empPosId = typeof e.position === 'object' ? e.position?._id : (e.position || e.position_id);
      return empPosId === posId;
  }).length;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Positions</h1>
          <p style={{ marginTop: "0.25rem", color: "gray" }}>Manage employee roles and departments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button style={{ display: "flex", gap: "8px" }}>
              <Plus size={16} /> Add Position
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Position</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); addPosition.mutate(); }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <Label>Department</Label>
                <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="General" />
              </div>
              <Button type="submit" disabled={addPosition.isPending}>
                Add Position
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {positions.length === 0 ? (
        <Card style={{ borderStyle: "dashed" }}>
          <CardContent style={{ padding: "3rem 0", textAlign: "center", color: "gray" }}>
            No positions yet. Add positions before assigning employees.
          </CardContent>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
          {positions.map((pos) => (
            <Card key={pos._id} style={{ transition: "box-shadow 0.2s" }}>
              <CardContent style={{ padding: "1.25rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>{pos.title}</h3>
                <p style={{ marginTop: "0.25rem", fontSize: "0.875rem", color: "gray" }}>{pos.department}</p>
                <div style={{ marginTop: "0.75rem" }}>
                  <span style={{ 
                    padding: "4px 12px", 
                    borderRadius: "9999px", 
                    fontSize: "0.875rem", 
                    fontWeight: "500",
                    backgroundColor: "#e0e7ff",
                    color: "#4f46e5"
                  }}>
                    {countForPosition(pos._id)} employees
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}