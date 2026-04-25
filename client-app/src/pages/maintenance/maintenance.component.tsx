import { Box, Typography } from "@mui/material";

function Maintenance() {
  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Maintenance
        </Typography>
      </Box>
    </div>
  );
}

export default Maintenance;
