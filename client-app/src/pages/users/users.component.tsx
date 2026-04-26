import * as MUI from "@mui/material";

function Users() {
  return (
    <div style={{ display: "flex" }}>
      <MUI.Box sx={{ p: 4, width: "100%" }}>
        <MUI.Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Hello World from the users
        </MUI.Typography>
      </MUI.Box>
    </div>
  );
}

export default Users;
