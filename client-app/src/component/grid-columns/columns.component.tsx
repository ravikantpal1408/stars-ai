import type { GridColDef } from "@mui/x-data-grid";
import type { Investor } from "../../model/investors.model";
import type { Deals } from "../../model/deal.model";
import { useState } from "react";
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

function ActionsCell({ id, onEdit, onDelete }: ActionsCellProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(id);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id={`long-button-${id}`}
        aria-controls={open ? `long-menu-${id}` : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`long-menu-${id}`}
        MenuListProps={{
          "aria-labelledby": `long-button-${id}`,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

/**
 * Returns column definitions for data grids.
 * @param gridType - Type of grid: "investor" or "deals"
 * @param onEdit - Callback function when edit action is clicked
 * @param onDelete - Callback function when delete action is clicked
 * @returns Array of GridColDef objects configured for displaying data
 */
export const getColumns = (
  gridType: string = "investor",
  onEdit?: (id: number | string) => void,
  onDelete?: (id: number | string) => void,
): GridColDef<Investor | Deals>[] => {
  const actionColumn: GridColDef = {
    field: "actions",
    headerName: "Actions",
    width: 100,
    align: "center",
    headerAlign: "center",
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <ActionsCell id={params.row.id} onEdit={onEdit} onDelete={onDelete} />
    ),
  };

  if (gridType === "deals") {
    return [
      actionColumn,
      { field: "deal_id", headerName: "Deal Id", width: 70 },
      {
        field: "deal_name",
        headerName: "Deal Name",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "approved_amount",
        headerName: "Approved Amount",
        width: 180,
        type: "number",
        valueFormatter: (value: any) =>
          value ? `$${Number(value).toLocaleString()}` : "$0",
      },
      {
        field: "region_name",
        headerName: "Region",
        width: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "funding_vehicle_name",
        headerName: "Funding Vehicle",
        width: 150,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "currency_code",
        headerName: "Currency",
        width: 130,
        align: "center",
        headerAlign: "center",
      },
    ];
  }

  // Investor Grid Columns
  if (gridType === "investor") {
    return [
      actionColumn,
      { field: "id", headerName: "ID", width: 70 },
      {
        field: "iinvestor_name",
        headerName: "Investor Name",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "aum_usd",
        headerName: "AUM (USD)",
        width: 180,
        type: "number",
        valueFormatter: (value: any) =>
          value ? `$${Number(value).toLocaleString()}` : "$0",
      },
      {
        field: "country_of_risk_code",
        headerName: "Country",
        width: 100,
        align: "center",
        headerAlign: "center",
      },
      { field: "ien_number", headerName: "IEN", width: 130 },
      {
        field: "bqr_date",
        headerName: "BQR Date",
        width: 150,
        valueGetter: (value: any) =>
          value ? new Date(value).toLocaleDateString() : "N/A",
      },
      {
        field: "nav_usd",
        headerName: "NAV (USD)",
        width: 180,
        type: "number",
        valueFormatter: (value: any) =>
          value ? `$${Number(value).toLocaleString()}` : "$0",
      },
      {
        field: "nav_date",
        headerName: "NAV Date",
        width: 150,
        valueGetter: (value: any) =>
          value ? new Date(value).toLocaleDateString() : "N/A",
      },
    ];
  }

  // Standard Dashboard Columns
  return [];
};
