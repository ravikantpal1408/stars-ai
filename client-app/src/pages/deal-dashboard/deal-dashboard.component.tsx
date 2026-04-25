import { Box, Typography } from "@mui/material";

function DealDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Investor Dashboard
        </Typography>
      </Box>
    </div>
  );
}

export default DealDashboard;
