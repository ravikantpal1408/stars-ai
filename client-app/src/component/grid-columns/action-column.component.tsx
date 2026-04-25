import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

interface ActionsCellProps {
  id: number | string;
  deal_id: number | string;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
  onAddInvestor?: (id: number | string, deal_id: number | string) => void;
  categoryType?: string;
}

const ActionsColumn = ({
  id,
  deal_id,
  onEdit,
  onDelete,
  onAddInvestor,
  categoryType = "",
}: ActionsCellProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate(); // 2. Initialize navigation

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (
    event: React.MouseEvent,
    callback?: (id: number | string) => void,
  ) => {
    event.stopPropagation();
    if (callback) {
      callback(id);
    }
    handleClose();
  };

  // Specific handler for Add Investor redirect
  const handleAddInvestorRedirect = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/deal-dashboard/investors?id=${id}&deal_id=${deal_id}`);
    if (onAddInvestor) onAddInvestor(id, deal_id);
    handleClose();
  };

  const menuProps: any = {
    id: `actions-menu-${id}`,
    anchorEl: anchorEl,
    open: open,
    onClose: handleClose,
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    MenuListProps: {
      "aria-labelledby": `actions-button-${id}`,
    },
    transformOrigin: { horizontal: "right", vertical: "top" },
    anchorOrigin: { horizontal: "right", vertical: "bottom" },
  };

  return (
    <>
      <IconButton
        id={`actions-button-${id}`}
        aria-label="more"
        aria-controls={open ? `actions-menu-${id}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : "false"}
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu {...menuProps}>
        {categoryType === "deals" && (
          <MenuItem onClick={handleAddInvestorRedirect}>
            <ListItemIcon>
              <PersonAddIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText>Add Investors</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={(e) => handleAction(e, onEdit)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={(e) => handleAction(e, onDelete)}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActionsColumn;
