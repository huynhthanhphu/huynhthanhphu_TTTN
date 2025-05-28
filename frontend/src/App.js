import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import LayoutFrontend from "./layouts/frontend";
import NotFound from "./pages/NotFound";
import RouterFrontend from "./router/RouterFrontend.js";
import LayoutBackend from "./layouts/backend";
import RouterBackend from "./router/RouterBackend";
import AdminLogin from "./pages/backend/auth/AdminLogin.js";
import ForgotPassword from "./pages/backend/auth/ForgotPassword.js";
import ResetPassword from "./pages/backend/auth/ResetPassword.js";

function App() {
  const isAuthenticated = !!localStorage.getItem("admin_token");

  let element = useRoutes([
    {
      path: "/",
      element: <LayoutFrontend />,
      children: RouterFrontend,
    },
    {
      path: "/admin",
      element: isAuthenticated ? <LayoutBackend /> : <Navigate to="/login" />,
      children: RouterBackend,
    },
    {
      path: "/login",
      element: <AdminLogin />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return element;
}

export default App;
