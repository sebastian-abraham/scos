import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAuthHeaders } from "../../utils/auth";

export default function ShopkeeperDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeframe, setTimeframe] = useState("Today");
  // Demo stats (replace with real data as needed)
  const stats = {
    totalSales: "$845.50",
    totalOrders: 62,
    mostPopular: "Veggie Burger",
  };

  // Fetch shop for this shopkeeper
  useEffect(() => {
    const fetchShop = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const headers = await getAuthHeaders();
        // Get all shops, filter by shopkeeper email
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/v1/shops`,
          { headers }
        );
        if (!res.ok) throw new Error("Failed to fetch shops");
        const data = await res.json();
        const shopsArr = (Array.isArray(data) ? data : data.shops || []).map(
          (shop) => ({
            ...shop,
            imageUrl:
              shop.shop_image !== undefined && shop.shop_image !== null
                ? `${import.meta.env.VITE_BACKEND_URL}/v1/shops/${
                    shop.id
                  }/image`
                : undefined,
          })
        );
        // Find shop where shopkeeper email matches user.email
        const myShop = shopsArr.find(
          (s) =>
            (s.shopkeeper && s.shopkeeper.email === user.email) ||
            s.shopkeeperEmail === user.email
        );
        setShop(myShop || null);
        setIsLive(!!(myShop && myShop.is_active));
      } catch (e) {
        setError("Could not load shop info");
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [user]);

  // Handler for toggling shop live/offline
  const handleToggleLive = async () => {
    if (!shop) return;
    setLoading(true);
    setError("");
    try {
      const headers = await getAuthHeaders();
      // PATCH/PUT to /v1/shops/:id with is_active
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v1/shops/${shop.id}`,
        {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !isLive }),
        }
      );
      if (!res.ok) throw new Error("Failed to update shop status");
      const updatedShop = await res.json();
      setShop((prev) => ({ ...prev, ...updatedShop }));
      setIsLive(updatedShop.is_active);
    } catch (e) {
      setError("Could not update shop status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col text-text-light dark:text-text-dark group/design-root">
      {/* Main Content Area */}
      <main className="flex-1 pb-28">
        {/* Top App Bar */}
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold leading-tight tracking-tight">
            Dashboard
          </h1>
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
              isLive
                ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
            }`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                isLive ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span>{isLive ? "Shop Open" : "Shop Closed"}</span>
          </div>
        </div>
        {/* Action Panel: Go Live Toggle */}
        <div className="p-4 @container">
          <div className="flex flex-1 flex-col items-center justify-between gap-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6 @[480px]:flex-row">
            <div className="flex flex-col gap-1 text-center @[480px]:text-left">
              <p className="text-xl font-bold leading-tight">
                {isLive ? "You're Online" : "You're Offline"}
              </p>
              <p className="text-base font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">
                Tap to {isLive ? "stop" : "start"} accepting new orders
              </p>
            </div>
            <label
              className={`relative flex h-[46px] w-[84px] cursor-pointer items-center rounded-full border-none bg-gray-200 dark:bg-gray-700 p-1 ${
                isLive ? "bg-primary" : ""
              }`}
              style={isLive ? { backgroundColor: "#28A745" } : {}}
            >
              <div
                className="h-[38px] w-[38px] transform transition-transform duration-300 ease-in-out rounded-full bg-white"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                  transform: isLive ? "translateX(38px)" : "translateX(0px)",
                }}
              ></div>
              <input
                className="invisible absolute"
                type="checkbox"
                checked={isLive}
                disabled={loading || !shop}
                onChange={handleToggleLive}
              />
            </label>
          </div>
          {error && (
            <div className="text-red-500 text-center mt-2">{error}</div>
          )}
        </div>
        {/* Section Header: At a Glance */}
        <h2 className="text-xl font-bold leading-tight tracking-tight px-4 pb-2 pt-4">
          At a Glance
        </h2>
        {/* Segmented Buttons: Timeframe Toggle */}
        <div className="flex px-4 py-3">
          <div className="flex h-11 flex-1 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            {["Today", "Yesterday"].map((label) => (
              <label
                key={label}
                className={`flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 text-text-muted-light dark:text-text-muted-dark has-[:checked]:bg-card-light has-[:checked]:dark:bg-card-dark has-[:checked]:shadow-sm has-[:checked]:text-text-light has-[:checked]:dark:text-text-dark text-sm font-medium leading-normal transition-colors duration-200 ${
                  timeframe === label
                    ? "bg-card-light dark:bg-card-dark shadow-sm text-text-light dark:text-text-dark"
                    : ""
                }`}
              >
                <span className="truncate">{label}</span>
                <input
                  className="invisible w-0"
                  name="timeframe-toggle"
                  type="radio"
                  value={label}
                  checked={timeframe === label}
                  onChange={() => setTimeframe(label)}
                />
              </label>
            ))}
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="flex flex-col gap-2 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4">
            <p className="text-sm font-medium leading-normal text-text-muted-light dark:text-text-muted-dark">
              Total Sales
            </p>
            <p className="text-3xl font-bold leading-tight tracking-tight">
              {stats.totalSales}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4">
            <p className="text-sm font-medium leading-normal text-text-muted-light dark:text-text-muted-dark">
              Total Orders
            </p>
            <p className="text-3xl font-bold leading-tight tracking-tight">
              {stats.totalOrders}
            </p>
          </div>
          <div className="col-span-2 flex flex-col gap-2 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4">
            <p className="text-sm font-medium leading-normal text-text-muted-light dark:text-text-muted-dark">
              Most Popular
            </p>
            <p className="text-3xl font-bold leading-tight tracking-tight">
              {stats.mostPopular}
            </p>
          </div>
        </div>
      </main>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border-light dark:border-border-dark bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-md items-center justify-around px-2">
          <a
            className="flex flex-col items-center justify-center gap-1 text-accent-light dark:text-accent-dark"
            href="#"
          >
            <span className="material-symbols-outlined text-3xl">
              storefront
            </span>
            <span className="text-xs font-medium">Live</span>
          </a>
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-1 text-text-light dark:text-text-dark focus:outline-none"
            onClick={() => navigate("/shopkeeper/menu")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <span className="material-symbols-outlined text-3xl">
              restaurant_menu
            </span>
            <span className="text-xs font-medium">Menu</span>
          </button>
          <a
            className="flex flex-col items-center justify-center gap-1 text-text-light dark:text-text-dark"
            href="#"
          >
            <span className="material-symbols-outlined text-3xl">
              receipt_long
            </span>
            <span className="text-xs font-medium">History</span>
          </a>
          <a
            className="flex flex-col items-center justify-center gap-1 text-text-light dark:text-text-dark"
            href="#"
          >
            <span className="material-symbols-outlined text-3xl">settings</span>
            <span className="text-xs font-medium">Settings</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
