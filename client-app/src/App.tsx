import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Users from "./pages/users/users.component";
import TopMenu from "./component/menu/top/top-menu.component";
import DealDashboard from "./pages/deal-dashboard/deal-dashboard.component";
import InvestorDashboard from "./pages/investor-dashboard/investor-dashboard.component";
import LpAssessment from "./pages/lp-assessment/lp-assessment.component";
import Maintenance from "./pages/maintenance/maintenance.component";
import Uploads from "./pages/uploads/uploads.component";
import EmailTracking from "./pages/email-tracking/email-tracking.component";
// import '@fontsource/roboto/*';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Users /> },
      { path: "/deal-dashboard", element: <DealDashboard /> },
      { path: "/email-tracking", element: <EmailTracking /> },
      { path: "/investor-dashboard", element: <InvestorDashboard /> },
      { path: "/lp-assessment", element: <LpAssessment /> },
      { path: "/maintenance", element: <Maintenance /> },
      { path: "/uploads", element: <Uploads /> }
    ],
  },
]);

function AppLayout() {
  return (
    <>
      <TopMenu />
      <Outlet />
    </>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
