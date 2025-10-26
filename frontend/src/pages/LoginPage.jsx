import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase"; // Make sure this path is correct
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // 🔹 Send the token to the backend for verification
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/v1/auth`,
        {
          idToken,
        }
      );

      // Navigate to dashboard on successful auth
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden text-[#0e1b0e] dark:text-gray-200">
      <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-stretch md:gap-6 gap-0 md:p-12 p-4">
          {/* Left: Image (on desktop), Logo/Title (on mobile) */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center md:justify-between md:pr-6 py-8 md:py-4">
            {/* Logo and Title (mobile only) */}
            <div className="flex items-center gap-3 mb-4 md:hidden">
              <span className="material-symbols-outlined text-4xl text-primary">
                restaurant_menu
              </span>
              <span className="text-2xl font-bold tracking-tight">SCOS</span>
            </div>
            {/* Image */}
            <div className="flex w-full pb-2 md:pb-0 md:pt-8">
              <div className="w-full aspect-[4/3] md:aspect-[3/4] max-h-64 md:max-h-none gap-1 overflow-hidden bg-[#f8fcf8] flex">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
                  data-alt="A modern canteen with people ordering food from digital kiosks."
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6PIYUS88Qray0JDvgohTQ6wUkHIGIQYJYU4uBEIvBxAOprAYeI716W-tJE-N_4TP-Uu7bUrOlg4ZtsZLRgHPztH_gcO2_08SYKIV8y6PXfqAIXfeKnwMcg4JbBALsNls4s9B6Z7AeNhYtOs9M-MmgPKrBEQshwwbCQDiR_wAPdUgn0eNaTLgpTS7OIBU-eRPJ8mmB_p0Pf1fX5YGHbcRt3fltF0wpGPgVdVOJrW0dlLM80UhNh04Gv3KR8da_fRdkM8t3fn3Yo_k")',
                  }}
                ></div>
              </div>
            </div>
            {/* Logo and Title (desktop only) */}
            <div className="hidden md:flex items-center gap-3 mt-8">
              <span className="material-symbols-outlined text-4xl text-primary">
                restaurant_menu
              </span>
              <span className="text-3xl font-bold tracking-tight">SCOS</span>
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 md:px-12 py-8 md:py-4">
            {/* Text Content */}
            <h1 className="text-[#0e1b0e] dark:text-gray-100 tracking-tight text-[32px] md:text-4xl font-bold leading-tight px-4 text-center pb-2 pt-6 md:pt-0">
              Effortless Canteen Ordering.
            </h1>
            <p className="text-[#0e1b0e] dark:text-gray-300 text-base md:text-lg font-normal leading-normal pb-6 pt-1 px-4 text-center">
              Skip the queue. Order your meals ahead of time.
            </p>

            {/* Login Button */}
            <div className="flex px-4 py-2 w-full mt-8">
              <button
                onClick={handleGoogleLogin}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-primary text-[#0e1b0e] gap-3 pl-5 text-base font-bold leading-normal tracking-[0.015em] transition-transform duration-200 hover:scale-105 active:scale-100"
              >
                <div className="google-icon"></div>
                <span className="truncate">Sign up with Google</span>
              </button>
            </div>

            {/* Helper Text */}
            <div className="flex justify-center items-center pt-4 pb-4 px-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Student or Manager just login and it will take you there.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
