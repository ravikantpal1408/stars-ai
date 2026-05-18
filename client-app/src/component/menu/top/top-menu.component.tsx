import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

function TopMenu({ darkMode, toggleTheme }) {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#d71e28",
        color: "#ffffff",
      }}
    >
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            title="Toggle light/dark theme"
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
        </Box>{" "}
      </Toolbar>
    </AppBar>
  );
}

export default TopMenu;
