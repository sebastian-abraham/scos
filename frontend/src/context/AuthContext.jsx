import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
       try {
          const idToken = await firebaseUser.getIdToken();
          
          // 🔹 Send token to backend for verification & user details
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/auth/`, { idToken });
          setUser(res.data.user);
        } catch (error) {
          console.log("Authentication error:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
