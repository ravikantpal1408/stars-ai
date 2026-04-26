import { Box, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DealService from "../../services/deals/deals.service";
import { useCallback, useEffect, useState } from "react";
import type { Deals } from "../../model/deal.model";
import { getColumns } from "../../component/grid-columns/columns.component.tsx";
import EditModal from "../../component/grid-columns/EditModal.tsx";

function DealDashboard() {
  const [deals, setDeals] = useState<Deals[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useState({
    open: false,
    selectedId: null as number | string | null,
    selectedDealId: null as number | string | null, // New state field
  });

  const handleCloseModal = (shouldRefresh?: boolean) => {
    setModalState({ ...modalState, open: false });
    // 2. If the modal saved successfully, refresh the grid data
    if (shouldRefresh === true) {
      getDeals();
    }
  };

  const getDeals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await DealService.getAllDeals();
      setDeals(data);
    } catch (error) {
      console.error("Failed to load deals:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = (id: number | string, deal_id: number | string) => {
    console.log("Edit deal with id:", id);
    setModalState({
      open: true,
      selectedId: id,
      selectedDealId: deal_id,
    });
    // TODO: Implement edit functionality
    // You can open a modal, navigate to edit page, etc.
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        // Replace with your actual service call:
        // await DealService.deleteDeal(id);
        console.log("Deleted:", id);
        getDeals(); // Refresh after delete
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  // 5. Trigger the fetch on component mount
  useEffect(() => {
    getDeals();
  }, [getDeals]);

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
              columns={getColumns("deals", handleEdit, handleDelete)}
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

      {/* The Separate Modal Component */}
      <EditModal
        open={modalState.open}
        // Pass a wrapper to handle the refresh logic
        onClose={(refresh) => handleCloseModal(refresh)}
        id={modalState.selectedId}
        deal_id={modalState.selectedDealId}
        categoryType="deals"
      />
    </div>
  );
}

export default DealDashboard;
