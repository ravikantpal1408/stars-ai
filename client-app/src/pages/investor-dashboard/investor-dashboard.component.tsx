import React, { useEffect, useState, useCallback } from "react";
import InvestorService from "../../services/investors/investors.service";
import { type Investor } from "../../model/investors.model.ts";
import { DataGrid, type GridPaginationModel } from "@mui/x-data-grid";
import { Box, Typography, Paper } from "@mui/material";
import { getColumns } from "../../component/grid-columns/columns.component.tsx";

function InvstorDashboard() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Add state for pagination and total count
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0, // MUI is 0-indexed
    pageSize: 10,
  });

  // 2. Update fetch function to accept pagination params
  const getInvestors = useCallback(async () => {
    try {
      setLoading(true);

      // Note: Backend usually expects 1-indexed pages, so we add 1
      const response = await InvestorService.getAllInvestors(
        paginationModel.page + 1,
        paginationModel.pageSize,
      );

      setInvestors(response.data);
      setRowCount(response.total);
    } catch (error) {
      console.error("Failed to load investors:", error);
    } finally {
      setLoading(false);
    }
  }, [paginationModel]);

  useEffect(() => {
    getInvestors();
  }, [getInvestors]);

  const handleEdit = (id: number | string) => {
    console.log("Edit:", id);
  };
  const handleDelete = (id: number | string) => {
    console.log("Delete:", id);
  };

  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Investor Dashboard
        </Typography>

        <Paper elevation={2}>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={investors}
              columns={getColumns("investor", handleEdit, handleDelete)}
              loading={loading}
              getRowId={(row) => row.id}
              // 3. Server-side Pagination Props
              paginationMode="server" // Crucial: tells DataGrid not to paginate locally
              rowCount={rowCount}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f5f5f5" },
              }}
            />
          </div>
        </Paper>
      </Box>
    </div>
  );
}

export default InvstorDashboard;
