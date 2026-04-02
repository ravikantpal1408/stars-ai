import { createBrowserRouter, RouterProvider } from "react-router";
import Users from "./pages/users/users.component";
import TopMenu from "./component/menu/top/top-menu.component";


const router = createBrowserRouter([
  { path: "/", element: <Users /> },
]);

function App() {
  return <>
    <TopMenu />
    <RouterProvider router={router} />;
  </>
}

export default App;
