import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { Fullscreen } from "@boengli/capacitor-fullscreen";

import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./config/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
import ManageUsers from "./pages/manager/ManageUsers";
import CreateShop from "./pages/manager/CreateShop";
import ManageShops from "./pages/manager/ManageShops";
function App() {
  useEffect(() => {
    const enterImmersiveMode = async () => {
      if (
        Capacitor.isNativePlatform() &&
        Capacitor.getPlatform() === "android"
      ) {
        try {
          await Fullscreen.activateImmersiveMode();
          console.log("Immersive mode activated");
        } catch (error) {
          console.error("Error activating immersive mode:", error);
        }
      }
    };
    enterImmersiveMode();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Student-only routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute requiredRole={["student", "manager"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Manager-only routes */}

          <Route
            path="/manager/users"
            element={
              <ProtectedRoute requiredRole="manager">
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/shops"
            element={
              <ProtectedRoute requiredRole="manager">
                <ManageShops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/shops/create"
            element={
              <ProtectedRoute requiredRole="manager">
                <CreateShop />
              </ProtectedRoute>
            }
          />
          {/* 404 Not Found route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
