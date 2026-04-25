import { useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

function DealInvestors() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const dealId = searchParams.get("deal_id");
  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ p: 4, width: "100%" }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Deal Investors : ID {id}... Deal Id {dealId}
        </Typography>
      </Box>
    </div>
  );
}

export default DealInvestors;
