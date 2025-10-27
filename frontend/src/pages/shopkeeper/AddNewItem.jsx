import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAuthHeaders } from "../../utils/auth";
export default function AddNewItem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shopId, setShopId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch shop for this shopkeeper (like ShopkeeperDashboard)
  useEffect(() => {
    const fetchShop = async () => {
      if (!user) return;
      try {
        const headers = await getAuthHeaders();
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
        const myShop = shopsArr.find(
          (s) =>
            (s.shopkeeper && s.shopkeeper.email === user.email) ||
            s.shopkeeperEmail === user.email
        );
        setShopId(myShop ? myShop.id : "");
      } catch (e) {
        setShopId("");
      }
    };
    fetchShop();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
    const headers = await getAuthHeaders();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/items/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          name,
          price,
          quantity,
          shop_id: shopId,
        }),
      });
      if (!res.ok) throw new Error("Failed to add item");
      navigate(-1); // Go back to menu page
    } catch (err) {
      setError(err.message || "Error adding item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-light dark:border-border-dark">
        <button
          className="text-text-light dark:text-text-dark flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Add New Item
        </h1>
        <div className="size-10 shrink-0"></div>
      </header>
      <main className="flex-1 flex flex-col p-4 space-y-6">
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <label className="flex flex-col w-full">
            <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
              Item Name
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-input-bg-light dark:bg-input-bg-dark h-14 placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 p-[15px] text-base font-normal leading-normal transition-shadow"
              placeholder="e.g., Samosa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col w-full">
            <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
              Item Price
            </p>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-text-light/70 dark:text-text-dark/70">
                  $
                </span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-input-bg-light dark:bg-input-bg-dark h-14 placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 pl-8 p-[15px] text-base font-normal leading-normal transition-shadow"
                placeholder="e.g., 15.00"
                step="0.01"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </label>
          <label className="flex flex-col w-full">
            <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
              Item Quantity
            </p>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-input-bg-light dark:bg-input-bg-dark h-14 placeholder:text-text-light/50 dark:placeholder:text-text-dark/50 p-[15px] text-base font-normal leading-normal transition-shadow [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="e.g., 50"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </label>

          {error && <div className="text-red-500 text-center">{error}</div>}
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity shadow-lg shadow-primary/30 disabled:opacity-60"
            disabled={loading}
          >
            <span className="truncate">{loading ? "Adding..." : "Submit"}</span>
          </button>
        </form>
      </main>
      {/* No footer needed, button is in form */}
    </div>
  );
}
