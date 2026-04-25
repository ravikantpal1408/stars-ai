import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    // mode: "custom",
    primary: {
      main: "#d71e28",
    },
  },
});

function TopMenu() {
  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar position="static">
        <Toolbar>
          {/* Left side: Logo and navigation links */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ mr: 3 }}>
              STARS-AI 🤖
            </Typography>
            <Button color="inherit" component={Link} to="/deal-dashboard">
              Deals
            </Button>
            <Button color="inherit" component={Link} to="/investor-dashboard">
              Investor
            </Button>
            <Button color="inherit" component={Link} to="/lp-assessment">
              LP Assessment
            </Button>
            <Button color="inherit" component={Link} to="/email-tracking">
              Email Tracking
            </Button>
            <Button color="inherit" component={Link} to="/maintenance">
              Maintenance
            </Button>
            <Button color="inherit" component={Link} to="/uploads">
              Uploads
            </Button>
          </Box>
          {/* Right side: Login and Register */}
          <Box>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>{" "}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default TopMenu;
