import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // On success, page will re-render due to auth state change
    } catch (error) {
      alert("Google sign-in failed: " + error.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h2>Login</h2>
      <button onClick={handleGoogleLogin} style={{ marginBottom: 24 }}>
        Sign in with Google
      </button>
      {/* ...existing code... */}
    </div>
  );
}
