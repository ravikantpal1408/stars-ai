import React, { useState } from "react";
import * as MUI from "@mui/material";

// --- Mock Data ---
const STATUS_OPTIONS = ["Active", "Closed", "Lead", "Negotiation"];
const CATEGORY_OPTIONS = ["Series A", "Series B", "Seed", "Angel"];
const PRIORITY_LEVELS = [
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
];

interface EditModalProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  id: number | string | null;
  deal_id: number | string | null;
  categoryType: string;
}

const EditModal = ({
  open,
  onClose,
  id,
  deal_id,
  categoryType,
}: EditModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "Active",
    category: "Seed",
    priority: 2,
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <MUI.Dialog
      open={open}
      onClose={() => onClose(false)}
      fullWidth
      maxWidth="md"
    >
      <MUI.DialogTitle sx={{ fontWeight: "bold" }}>
        Edit {categoryType === "deals" ? "Deal" : "Investor"}
      </MUI.DialogTitle>

      <MUI.DialogContent dividers>
        {/* --- One-Liner Box --- */}
        <MUI.Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "#f9f9f9",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <MUI.Typography variant="body1">
            Editing Record ID: <strong>{id}</strong>
          </MUI.Typography>
          <MUI.Typography variant="subtitle2" color="textSecondary">
            Deal ID: <strong>{deal_id}</strong>
          </MUI.Typography>
        </MUI.Box>

        {/* --- Form Section: Fixed Grid Syntax --- */}
        <MUI.Grid container spacing={3}>
          {/* Note: In MUI v6, we use size={{ xs: 12 }} and REMOVE the 'item' prop */}
          <MUI.Grid size={{ xs: 12, sm: 6 }}>
            <MUI.TextField
              fullWidth
              label="Entity Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </MUI.Grid>

          <MUI.Grid size={{ xs: 12, sm: 6 }}>
            <MUI.TextField
              fullWidth
              label="Contact Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </MUI.Grid>

          <MUI.Grid size={{ xs: 12, sm: 4 }}>
            <MUI.TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MUI.MenuItem key={opt} value={opt}>
                  {opt}
                </MUI.MenuItem>
              ))}
            </MUI.TextField>
          </MUI.Grid>

          <MUI.Grid size={{ xs: 12, sm: 4 }}>
            <MUI.TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <MUI.MenuItem key={opt} value={opt}>
                  {opt}
                </MUI.MenuItem>
              ))}
            </MUI.TextField>
          </MUI.Grid>

          <MUI.Grid size={{ xs: 12, sm: 4 }}>
            <MUI.TextField
              select
              fullWidth
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {PRIORITY_LEVELS.map((level) => (
                <MUI.MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MUI.MenuItem>
              ))}
            </MUI.TextField>
          </MUI.Grid>

          <MUI.Grid size={{ xs: 12 }}>
            <MUI.TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </MUI.Grid>
        </MUI.Grid>
      </MUI.DialogContent>

      <MUI.DialogActions sx={{ px: 3, py: 2 }}>
        <MUI.Button onClick={() => onClose(false)} color="inherit">
          Cancel
        </MUI.Button>
        <MUI.Button variant="contained" onClick={() => onClose(true)}>
          Save Changes
        </MUI.Button>
      </MUI.DialogActions>
    </MUI.Dialog>
  );
};

export default EditModal;
