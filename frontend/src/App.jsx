import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./config/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
// import ManagerDashboard from "./pages/ManagerDashboard";
// import StudentDashboard from "./pages/StudentDashboard";

function App() {
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
              <ProtectedRoute requiredRole="student">
                <Dashboard />
                {/* Or <StudentDashboard /> if you have a separate component */}
              </ProtectedRoute>
            }
          />

          {/* Manager-only routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute requiredRole="manager">
                {/* Or <ManagerDashboard /> if you have a separate component */}
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
