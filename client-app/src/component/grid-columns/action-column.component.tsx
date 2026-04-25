import React, { useState } from "react";
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

interface ActionsCellProps {
  id: number | string;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
}

const ActionsColumn = ({ id, onEdit, onDelete }: ActionsCellProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // We define the menu props as a separate object and cast it to 'any'
  // This stops the "Property MenuListProps does not exist" error immediately.
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
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit(id);
            handleClose();
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete(id);
            handleClose();
          }}
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
