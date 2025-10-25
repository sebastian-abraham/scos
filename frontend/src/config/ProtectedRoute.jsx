import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // or a spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
