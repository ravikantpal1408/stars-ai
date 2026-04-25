import type { GridColDef } from "@mui/x-data-grid";
import type { Investor } from "../../model/investors.model";
import type { Deals } from "../../model/deal.model";

/**
 * Returns column definitions for data grids.
 * @param gridType - Type of grid: "investor" or "deals"
 * @returns Array of GridColDef objects configured for displaying data
 */
export const getColumns = (
  gridType: string = "investor",
): GridColDef<Investor | Deals>[] => {
  if (gridType === "deals") {
    return [
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

  // Deal Grid Columns
  if (gridType === "investor") {
    return [
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
