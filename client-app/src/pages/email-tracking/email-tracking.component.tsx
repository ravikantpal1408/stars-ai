import { Box, Paper, Typography } from "@mui/material";

function EmailTracking() {
  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Email Tracking
        </Typography>
        <Paper elevation={2}>
          <div style={{ height: 600, width: "100%" }}></div>
        </Paper>
      </Box>
    </div>
  );
}

export default EmailTracking;
