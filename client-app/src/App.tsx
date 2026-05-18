import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Users from "./pages/users/users.component.tsx";
import TopMenu from "./component/menu/top/top-menu.component.tsx";
import DealDashboard from "./pages/deal-dashboard/deal-dashboard.component.tsx";
import InvestorDashboard from "./pages/investor-dashboard/investor-dashboard.component.tsx";
import LpAssessment from "./pages/lp-assessment/lp-assessment.component.tsx";
import Maintenance from "./pages/maintenance/maintenance.component.tsx";
import Uploads from "./pages/uploads/uploads.component.tsx";
import EmailTracking from "./pages/email-tracking/email-tracking.component.tsx";
import DealInvestors from "./pages/deal-investor/deal-investor.component.tsx";
import { useState } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
// import '@fontsource/roboto/*';

function AppLayout({
  darkMode,
  toggleTheme,
}: {
  darkMode: boolean;
  toggleTheme: () => void;
}) {
  return (
    <>
      <TopMenu darkMode={darkMode} toggleTheme={toggleTheme} />
      <Outlet />
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#d71e28",
      },
    },
  });
  const router = createBrowserRouter([
    {
      element: <AppLayout darkMode={darkMode} toggleTheme={toggleTheme} />,
      children: [
        { path: "/", element: <Users /> },
        { path: "/deal-dashboard", element: <DealDashboard /> },
        { path: "/deal-dashboard/investors", element: <DealInvestors /> },
        { path: "/email-tracking", element: <EmailTracking /> },
        { path: "/investor-dashboard", element: <InvestorDashboard /> },
        { path: "/lp-assessment", element: <LpAssessment /> },
        { path: "/maintenance", element: <Maintenance /> },
        { path: "/uploads", element: <Uploads /> },
        { path: "/email-tracking", element: <EmailTracking /> },
      ],
    },
  ]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
