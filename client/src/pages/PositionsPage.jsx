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

import "../styles/positions.css";

export default function PositionsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", department: "" });

  const { data: positions = [] } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const res = await api.get("/positions");
      return res.data;
    },
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get("/employees");
      return res.data.filter((e) => e.is_active !== false);
    },
  });

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

  const countForPosition = (posId) =>
    employees.filter((e) => {
      const empPosId =
        typeof e.position === "object"
          ? e.position?._id
          : e.position || e.position_id;
      return empPosId === posId;
    }).length;

  return (
    <div className="positions-page">
      <div className="positions-header">
        <div>
          <h1 className="positions-title">Positions</h1>
          <p className="positions-subtitle">
            Manage employee roles and departments
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="positions-add-btn">
              <Plus size={16} /> Add Position
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Position</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addPosition.mutate();
              }}
              className="positions-form"
            >
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Department</Label>
                <Input
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  placeholder="General"
                />
              </div>

              <Button type="submit" disabled={addPosition.isPending}>
                Add Position
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {positions.length === 0 ? (
        <Card className="positions-empty-card">
          <CardContent className="positions-empty-content">
            No positions yet. Add positions before assigning employees.
          </CardContent>
        </Card>
      ) : (
        <div className="positions-grid">
          {positions.map((pos) => (
            <Card key={pos._id} className="positions-card">
              <CardContent className="positions-card-content">
                <h3 className="positions-card-title">{pos.title}</h3>
                <p className="positions-card-department">
                  {pos.department}
                </p>

                <div className="positions-card-footer">
                  <span className="positions-badge">
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