import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAuthHeaders } from "../../utils/auth";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      setError("");
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/v1/shops`,
          { headers }
        );
        if (!res.ok) throw new Error("Failed to fetch shops");
        const data = await res.json();
        setShops(Array.isArray(data) ? data : data.shops || []);
      } catch (e) {
        setError(e.message || "Could not load canteens");
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, [user]);

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      <main className="flex-1 pb-24">
        {/* TopAppBar */}
        <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 p-4 pb-2 justify-between backdrop-blur-sm">
          <div className="flex size-12 shrink-0 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: user?.imageurl
                  ? `url('${user.imageUrl}')`
                  : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCi25IYrXIdoCDlH_xVDINFsgqalZlqDS2bXbY0qSNAkoOIZXmYPdYwnhKA_vQ9rc-vmWCU3odlcpK7u-A6AxaD3f1-nSnIVPfsFWtssnSiobKLwfZTBpQoEdB-PkmyADOhWDS-Z2wV3vGpeJ7pN9fNEi3ucVU4-eqPXkk07yCvk-rlFNMnXU_qWc0_nSGyHjLin5PQUiK4VhHrS7dFgWRkdgpLsEw9luTqSDgu8vpc5Vq7LT5UZScuyqEg4nOsG4aYF-EO7cpYbyU")',
              }}
              data-alt={`User profile picture of ${user?.firstName || "Alex"}`}
            ></div>
          </div>
          <h1 className="text-[#0e1b0e] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1">
            Hi, {user?.firstName || "Alex"}!
          </h1>
          <div className="flex w-12 items-center justify-end">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-[#0e1b0e] dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
              <span className="material-symbols-outlined text-[#0e1b0e] dark:text-white">
                notifications
              </span>
            </button>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-[#0e1b0e] dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
              <span className="material-symbols-outlined text-[#0e1b0e] dark:text-white">
                notifications
              </span>
            </button>
          </div>
        </header>
        {/* SearchBar */}
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-[0_0_4px_rgba(0,0,0,0.05)]">
              <div className="text-primary flex border-none bg-white dark:bg-background-dark items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e1b0e] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-white dark:bg-background-dark focus:border-none h-full placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                placeholder="Search for canteens or stalls..."
                value=""
                readOnly
              />
            </div>
          </label>
        </div>
        {/* Chips */}
        <div className="flex gap-3 px-4 pb-3 overflow-x-auto">
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 dark:bg-primary/30 px-3">
            <span className="material-symbols-outlined text-sm text-[#0e1b0e] dark:text-white">
              tune
            </span>
            <p className="text-[#0e1b0e] dark:text-white text-sm font-medium leading-normal">
              Sort By
            </p>
            <span className="material-symbols-outlined text-base text-[#0e1b0e] dark:text-white">
              expand_more
            </span>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-background-dark px-3 shadow-[0_0_4px_rgba(0,0,0,0.05)]">
            <p className="text-[#0e1b0e] dark:text-white text-sm font-medium leading-normal">
              Open Now
            </p>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-background-dark px-3 shadow-[0_0_4px_rgba(0,0,0,0.05)]">
            <p className="text-[#0e1b0e] dark:text-white text-sm font-medium leading-normal">
              Cuisine
            </p>
            <span className="material-symbols-outlined text-base text-[#0e1b0e] dark:text-white">
              expand_more
            </span>
          </button>
          <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-background-dark px-3 shadow-[0_0_4px_rgba(0,0,0,0.05)]">
            <p className="text-[#0e1b0e] dark:text-white text-sm font-medium leading-normal">
              Halal
            </p>
          </button>
        </div>
        {/* SectionHeader */}
        <h2 className="text-[#0e1b0e] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          All Canteens
        </h2>
        {/* Card List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="text-center py-8">Loading canteens...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : shops.length === 0 ? (
            <div className="text-center py-8">No canteens found.</div>
          ) : (
            shops.map((shop, idx) => {
              const open_time = shop.open_time
                ? shop.open_time.slice(0, 5)
                : null;
              const close_time = shop.close_time
                ? shop.close_time.slice(0, 5)
                : null;
              const isDisabled = shop.is_active === false;
              const cardClass =
                "px-4 @container" +
                (isDisabled
                  ? " opacity-50 pointer-events-none select-none cursor-not-allowed"
                  : " cursor-pointer");
              return (
                <div
                  className={cardClass}
                  key={shop.id || idx}
                  onClick={
                    isDisabled ? undefined : () => navigate(`/shops/${shop.id}`)
                  }
                  tabIndex={isDisabled ? -1 : 0}
                  role="button"
                  aria-label={`View menu for ${shop.name}`}
                  onKeyDown={
                    isDisabled
                      ? undefined
                      : (e) => {
                          if (e.key === "Enter" || e.key === " ")
                            navigate(`/shops/${shop.id}`);
                        }
                  }
                  aria-disabled={isDisabled}
                >
                  <div className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden shadow-[0_0_12px_rgba(0,0,0,0.07)] bg-white dark:bg-gray-800">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                      style={{
                        backgroundImage: shop.shop_image
                          ? `url(${import.meta.env.VITE_BACKEND_URL}/v1/shops/${
                              shop.id
                            }/image)`
                          : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPT8-LniBDswxcDMfbsT2HTb7sJ4k2yIqgz732DWvXT9JOQPhD2K0AZ6aFVRVhVMnuYcpnSPb3R3_c3dnMqeGwyFIV57gAYHkRUQVIq4ov61EmgJVJpM7HgGrwO0SZs9dMh35hjnGRXaPIwHFxCnjkiGYxToHNKUa1fPfbVhsVYdZcIFTnTG0wR5QuKdNb9B0bse75cjKKmWHc5Ezpc41aQbywWsWmlklbHtX4y5AI_QKKtBPjdLVJQf4ydCGzvHkY2JZUrhl2zfc")',
                      }}
                      data-alt={shop.name}
                    ></div>
                    <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${
                            shop.is_active !== false
                              ? "bg-primary"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        <span
                          className={`text-xs font-semibold ${
                            shop.is_active !== false
                              ? "text-primary dark:text-primary"
                              : "text-gray-500"
                          }`}
                        >
                          {shop.is_active !== false ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-[#0e1b0e] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                        {shop.name}
                      </p>
                      <div className="flex items-end gap-3 justify-between">
                        <div className="flex flex-col gap-1">
                          <p className="text-gray-600 dark:text-gray-300 text-sm font-normal leading-normal">
                            {open_time && close_time
                              ? `Hours: ${open_time} - ${close_time}`
                              : "Hours not specified"}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm font-normal leading-normal">
                            {shop.location
                              ? shop.location
                              : "Location not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 flex justify-around items-center px-4">
        <a className="flex flex-col items-center gap-1 text-primary" href="#">
          <span className="material-symbols-outlined">home</span>
          <span className="text-xs font-bold">Home</span>
        </a>
        <a
          className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400"
          href="#"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-xs font-medium">Orders</span>
        </a>
        <a
          className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400"
          href="#"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-xs font-medium">Cart</span>
        </a>
        <a
          className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400"
          href="#"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-xs font-medium">Profile</span>
        </a>
      </nav>
    </div>
  );
}
