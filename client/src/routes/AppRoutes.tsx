import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { AppDispatch } from "../app/store";
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/dashboard/Analytics";
import Employees from "../pages/dashboard/Employees";
import Finance from "../pages/dashboard/Finance";
import Inventory from "../pages/dashboard/Inventory";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import { loadCurrentUser } from "../features/auth/authSlice";
import useAuth from "../hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && !user) {
      void dispatch(loadCurrentUser());
    }
  }, [dispatch, token, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <Finance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
