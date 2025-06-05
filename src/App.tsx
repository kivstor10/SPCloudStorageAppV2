import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import { 
  Layout,
  Landing, 
  AdminLog,
  UserManagement,
  Loadout,
  Error 
} from "./pages";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "@aws-amplify/ui-react/styles.css";
import CircularProgress from '@mui/material/CircularProgress'; 

const AdminRoutes = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const session = await fetchAuthSession();
        const groups = session.tokens?.accessToken?.payload?.['cognito:groups'] || [];
        setIsAdmin((groups as string[]).includes('Admins'));
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (isLoading) {
    return <div style={
      { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }
    }>
      <CircularProgress color="inherit"/>
    </div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />; 
  }

  return (
    <Routes>
      <Route path="/log" element={<AdminLog />} />
      <Route path="/usermanagement" element={<UserManagement />} />
      <Route path="*" element={<Error />} /> 
    </Routes>
  );
};

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
        path: "/loadout/:loadoutId",
        element: <Loadout />,
      },
      {
        path: "/admin/*",
        element: <AdminRoutes />,
      },
      {
        path: "*",  
        element: <Error />,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
