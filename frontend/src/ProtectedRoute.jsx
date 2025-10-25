import { Navigate } from "react-router-dom";

// For now, always redirect to /login if not authenticated (hardcoded false)
export default function ProtectedRoute({ children }) {
  const isAuthenticated = false; // TODO: Replace with real auth logic
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
