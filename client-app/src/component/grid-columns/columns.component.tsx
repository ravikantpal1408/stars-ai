import type { GridColDef } from "@mui/x-data-grid";
import type { Investor } from "../../model/investors.model";

/**
 * Returns column definitions for the Investor data grid.
 * @param isDealGrid - Boolean flag to toggle between standard and deal-specific columns.
 * @returns Array of GridColDef objects configured for displaying Investor data
 */
export const getInvestorColumns = (
  gridType: string = "investor",
): GridColDef<Investor>[] => {
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
      { field: "ien_number", headerName: "IEN", width: 130 },
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
