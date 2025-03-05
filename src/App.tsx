import "./App.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { 
  Layout,
  Landing, 
  SignIn,
  AdminLog,
  UserManagement
} from "./pages";
import {
  Route,
  Routes,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "@aws-amplify/ui-react/styles.css";

const AdminRoutes = () => (
  <Authenticator>
    <Routes>
      <Route path="/log" element={<AdminLog />} />
      <Route path="/usermanagement:id" element={<UserManagement />} />
    </Routes>
  </Authenticator>
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
        element: <SignIn />,
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