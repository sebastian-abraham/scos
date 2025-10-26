import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * ProtectedRoute component for role-based route protection.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component(s) to render if access is allowed.
 * @param {string|string[]} [props.requiredRole] - The required role(s) for this route (e.g., 'student', 'manager').
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, role } = useContext(AuthContext);

  if (loading) return null; // or a spinner
  if (!user) return <Navigate to="/login" replace />;

  // If requiredRole is specified, check if user's role matches
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];
    if (!allowedRoles.includes(role)) {
      // Optionally, redirect to a forbidden page or home
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
