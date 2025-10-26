import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 text-center">
        <div className="flex w-full max-w-sm md:max-w-xl lg:max-w-2xl flex-col items-center gap-8 md:gap-12">
          <div className="flex flex-col items-center gap-6 md:gap-8">
            {/* Big 404 */}
            <div className="font-extrabold text-6xl md:text-8xl lg:text-9xl text-primary drop-shadow-sm mb-2 md:mb-4 select-none">
             Error 404
            </div>
            <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 p-2 md:p-4 lg:p-6 bg-white/70 dark:bg-gray-900/60">
              <img
                className="h-40 w-40 md:h-64 md:w-64 lg:h-80 lg:w-80 rounded-lg"
                alt="An illustration of an empty plate with a sad face, and a fork and spoon on the sides."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAswas2Eq3aNJygKatjvawhCF8iPSK99ly0u2IVRfTMrWBOtlw-UJKomKxSCYHEo5PwAarkNq7OoeLVWlQuO008OYv-TEq7jEAqx8erdRuF_XAsErJCRl3oWsT-7DoCgO5d-cOn3x0MhQH5qcCFnnbjkRolxABqVUpj7BpkRjGfyHYQ6aVuV2rSQV674Nzf3rK11wqoq9zTB7BW2wtN_Qu4UiKnkKgm6_uPmlfyDPPpLcxTYrYHx3Yj14ZfHd3oaTlCdC-L_lVsIV4"
              />
            </div>
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Oops! Page Not Found
              </h1>
              <p className="text-sm md:text-lg lg:text-xl text-gray-600 dark:text-gray-300">
                The page you're looking for doesn't exist or has been taken off.
              </p>
            </div>
          </div>
          <button
            className="flex w-full md:w-auto cursor-pointer items-center justify-center rounded-lg h-12 px-6 md:px-10 bg-primary text-white text-base md:text-lg font-bold transition-colors hover:bg-primary/90"
            onClick={() => navigate("/")}
          >
            <span className="truncate">Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
