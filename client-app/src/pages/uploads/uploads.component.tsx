import { Box, Typography } from "@mui/material";

function Uploads() {
  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Uploads
        </Typography>
      </Box>
    </div>
  );
}

export default Uploads;
