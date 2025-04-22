import "./App.css";
// import { Authenticator } from "@aws-amplify/ui-react";
import { 
  Layout,
  Landing, 
  Signin,
  AdminLog,
  UserManagement,
  Loadout
} from "./pages";
import {
  Route,
  Routes,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "@aws-amplify/ui-react/styles.css";

const AdminRoutes = () => (

    <Routes>
      <Route path="/log" element={<AdminLog />} />
      <Route path="/usermanagement" element={<UserManagement />} />
    </Routes>

);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/sign-in",
        element: <Signin />,
      },
      {
        path: "/loadout/:loadoutId",
        element: <Loadout />,
      },
      {
        path: "/admin/*",
        element: <AdminRoutes />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;