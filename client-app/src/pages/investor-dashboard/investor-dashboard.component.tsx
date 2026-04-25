import React, { useEffect, useState } from "react";
import InvestorService from "../../services/investors/investors.service";
import { type Investor } from "../../model/investors.model.ts";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper } from "@mui/material";
import { getInvestorColumns } from "../../component/grid-columns/columns.component.tsx";

function InvstorDashboard() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getInvestors = async () => {
    try {
      setLoading(true);
      const data = await InvestorService.getAllInvestors();
      setInvestors(data);
    } catch (error) {
      console.error("Failed to load investors:", error);
    } finally {
      setLoading(false);
    }
  };

  // 5. Trigger the fetch on component mount
  useEffect(() => {
    getInvestors();
  }, []);

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
              columns={getInvestorColumns("investor")}
              loading={loading}
              showToolbar
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
                filter: {
                  ...investors.filter,
                  filterModel: {
                    items: [
                      {
                        field: "iinvestor_name",
                        operator: "contains",
                        value: "",
                      },
                    ],
                  },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          </div>
        </Paper>
      </Box>
    </div>
  );
}

export default InvstorDashboard;
