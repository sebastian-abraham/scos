import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage() {
  const navigate = useNavigate();

  // Set Sora font for desktop consistency
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.classList.add("font-display");
    return () => {
      document.body.classList.remove("font-display");
      document.head.removeChild(link);
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/auth`, {
        idToken,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left: Text & Button */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left px-4">
          <div className="flex items-center gap-3 mb-8">
            {/* Logo Icon (SVG for desktop, fallback to material icon for mobile) */}
            <span className="hidden md:inline">
              <svg
                className="w-8 h-8 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 8c0 2.21-1.79 4-4 4S8 10.21 8 8c0-1.48.81-2.75 2-3.45V1h4v3.55c1.19.7 2 1.97 2 3.45zM15 15.5c0 .83-.67 1.5-1.5 1.5h-3C9.67 17 9 16.33 9 15.5V12h6v3.5zM14.27 5.06C13.19 4.39 12 3.5 12 3.5s-1.19.89-2.27 1.56C8.65 5.58 8 6.74 8 8v1h8V8c0-1.26-.65-2.42-1.73-2.94zM18.89 7.77C18.96 7.52 19 7.26 19 7c0-2.21-1.79-4-4-4-.74 0-1.45.2-2.06.56C12.42 3.2 12 2.83 12 2.34V1c0-.55-.45-1-1-1s-1 .45-1 1v1.34c0 .49-.42.86-.94.56C8.45 3.2 7.74 3 7 3c-2.21 0-4 1.79-4 4 0 .26.04.52.11.77-.55.93-.89 2.02-.89 3.23v1.5C2.22 14.29 4 16.63 4 18v3h14v-3c0-1.37 1.78-3.71 1.78-5.5v-1.5c0-1.21-.34-2.29-.89-3.23zM16 18H6v-1.5c0-1.38 2.24-4 6-4s6 2.62 6 4V18z"></path>
              </svg>
            </span>
            <span className="md:hidden material-symbols-outlined text-4xl text-primary">
              restaurant_menu
            </span>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              SCOS
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            Effortless Canteen Ordering.
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8">
            Skip the queue. Order your meals ahead of time.
          </p>
          <div className="w-full max-w-sm flex flex-col items-center md:items-start">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 mb-4"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  fill="#FFC107"
                ></path>
                <path
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  fill="#FF3D00"
                ></path>
                <path
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.658-3.657-11.303-8.428l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  fill="#4CAF50"
                ></path>
                <path
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C43.021,36.251,44,30.651,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  fill="#1976D2"
                ></path>
              </svg>
              <span>Sign up with Google</span>
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-center md:text-left">
              Student or Manager login
            </span>
          </div>
        </div>
        {/* Right: Image */}
        <div className="flex justify-center md:justify-end mt-8 md:mt-0">
          <img
            alt="People ordering food from self-service kiosks in a modern canteen."
            className="rounded-2xl shadow-2xl w-full max-w-md md:max-w-none object-cover aspect-[4/5] md:aspect-auto"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8UYdmoVR2uswsp0T7CcxmXCMkyzgZZ5vJP2L_fW9L9PfGUKvcZGKbQodH0MbTOokJLC2tLwabM6oikOVMoWRo2J1U1-hmQnJFNSEAALWJ4FekKevF9NsI0OmWmk2gZ9Q91ELeWMA0Pb5aDffsH2LcQImqMCrnaik_qA7-8XTke7dnt4bIBc2AHhmuGaMiC6-21qjmB-vAsFDevzK8u5hnMetY2n2rxeha9WkMM2_flyXj7NQApLEwCu9lRQOrr8A1OLYicBTkU3fb"
          />
        </div>
      </div>
    </div>
  );
}
