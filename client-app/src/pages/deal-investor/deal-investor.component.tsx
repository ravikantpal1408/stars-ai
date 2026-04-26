import { useSearchParams } from "react-router-dom";
import * as MUI from "@mui/material";

function DealInvestors() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const dealId = searchParams.get("deal_id");
  return (
    <MUI.Box style={{ display: "flex" }}>
      <MUI.Box sx={{ p: 4, width: "100%" }}>
        <MUI.Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Deal Investors : ID {id}... Deal Id {dealId}
        </MUI.Typography>
        <MUI.Paper elevation={2}>
          <MUI.Box style={{ height: 600, width: "100%" }}></MUI.Box>
        </MUI.Paper>
      </MUI.Box>
    </MUI.Box>
  );
}

export default DealInvestors;
