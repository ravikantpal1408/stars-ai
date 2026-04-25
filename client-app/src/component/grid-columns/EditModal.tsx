import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

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
  const handleSave = async () => {
    // ... your save logic ...
    onClose(true); // Now this is valid
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="sm">
      <DialogTitle>
        Edit {categoryType === "deals" ? "Deal" : "Investor"}
      </DialogTitle>
      <DialogContent dividers>
        <Typography>
          Editing Record ID: <strong>{id}</strong>
        </Typography>

        <Typography variant="subtitle2" color="textSecondary">
          Deal ID: {deal_id}
        </Typography>
        {/* Your form fields (TextField, etc.) go here */}
        <p>this is the paragraph inside the modal pop up</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>{" "}
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
