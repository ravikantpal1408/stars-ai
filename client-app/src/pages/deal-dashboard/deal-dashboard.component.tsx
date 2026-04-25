import { Box, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DealService from "../../services/deals/deals.service";
import { useEffect, useState } from "react";
import type { Deals } from "../../model/deal.model";
import { getColumns } from "../../component/grid-columns/columns.component.tsx";

function DealDashboard() {
  const [deals, setDeals] = useState<Deals[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getDeals = async () => {
    try {
      setLoading(true);
      const data = await DealService.getAllDeals();
      setDeals(data);
    } catch (error) {
      console.error("Failed to load investors:", error);
    } finally {
      setLoading(false);
    }
  };

  // 5. Trigger the fetch on component mount
  useEffect(() => {
    getDeals();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Deal Dashboard
        </Typography>

        <Paper elevation={2}>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={deals}
              columns={getColumns("deals")}
              loading={loading}
              showToolbar
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
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

export default DealDashboard;
