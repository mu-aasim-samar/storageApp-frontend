import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import DirectoryView from "./DirectoryView";
import Register from "./Register";
import Login from "./Login";
import UsersPage from "./UsersPage";
import LandingPage from "./LandingPage";
import SubscriptionPage from "./SubscriptionPage";
import OneTapProvider from "./components/OneTapProvider";
import ProtectedRoute from "./components/ProtectedRoute";

// Root layout — mounts OneTapProvider so it has router context
function RootLayout() {
  return (
    <>
      <OneTapProvider />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/landing", element: <LandingPage /> },
      { path: "/", element: <DirectoryView /> },
      { path: "/drive", element: <Navigate to="/" replace /> },
      { path: "/directory/:dirId", element: <DirectoryView /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["Owner", "Admin", "Manager"]}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:userId/drive",
        element: (
          <ProtectedRoute allowedRoles={["Owner", "Admin", "Manager"]}>
            <DirectoryView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:userId/drive/:dirId",
        element: (
          <ProtectedRoute allowedRoles={["Owner", "Admin", "Manager"]}>
            <DirectoryView />
          </ProtectedRoute>
        ),
      },

      { path: "/subscription", element: <SubscriptionPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
