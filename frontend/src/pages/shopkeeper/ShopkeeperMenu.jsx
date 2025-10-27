import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAuthHeaders } from "../../utils/auth";
import React from "react";
import { useNavigate } from "react-router-dom"

export default function ShopkeeperMenu() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shopId, setShopId] = useState("");

  // Fetch shop for this shopkeeper (like ShopkeeperDashboard)
  useEffect(() => {
    const fetchShopAndItems = async () => {
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
        if (!myShop) throw new Error("No shop found for this user");
        setShopId(myShop.id);
        // Fetch items for this shop
        const itemsRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/v1/items?shop_id=${myShop.id}`,
          { headers }
        );
        if (!itemsRes.ok) throw new Error("Failed to fetch items");
        const itemsData = await itemsRes.json();
        setItems(Array.isArray(itemsData) ? itemsData : itemsData.items || []);
      } catch (e) {
        setError(e.message || "Could not load menu items");
      } finally {
        setLoading(false);
      }
    };
    fetchShopAndItems();
  }, [user]);
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="text-gray-800 dark:text-gray-200 flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </div>
        <h2 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Manage Menu
        </h2>
        <div className="flex size-12 shrink-0 items-center justify-end"></div>
      </div>
      {/* Meta Text */}
      <p className="text-green-700 dark:text-green-500 text-sm font-normal leading-normal py-3 px-4 text-center bg-green-500/10 dark:bg-green-500/20">
        Shop is Closed. Changes will be live when you open.
      </p>
      {/* Button Group */}
      <div className="flex flex-col sm:flex-row gap-3 px-4 py-4">
        <button
          className="flex flex-1 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-30 px-5 bg-primary text-gray-900 dark:text-black text-base font-bold leading-normal tracking-[0.015em] text-xl"
          onClick={() => navigate("/shopkeeper/menu/add")}
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="truncate">Add New Item</span>
        </button>
        <button className="flex flex-1 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-30 px-5 bg-primary/20 dark:bg-primary/30 text-gray-900 dark:text-gray-100 text-base font-bold leading-normal tracking-[0.015em] text-xl">
          <span className="material-symbols-outlined">qr_code_scanner</span>
          <span className="truncate">Scan Paper Menu</span>
        </button>
      </div>
      {/* Search Bar */}
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div className="text-gray-500 dark:text-gray-400 flex bg-gray-200 dark:bg-gray-800 items-center justify-center pl-4 rounded-l-xl border-r-0">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-0 border-none bg-gray-200 dark:bg-gray-800 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 pl-2 text-base font-normal leading-normal"
              placeholder="Search for an item..."
              value=""
              readOnly
            />
          </div>
        </label>
      </div>
      {/* Section Header */}
      <div className="flex justify-between items-center px-4 pb-2 pt-4">
        <h3 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em]">
          All Items
        </h3>
        <div className="flex gap-2 text-gray-500 dark:text-gray-400">
          <span className="material-symbols-outlined p-2 rounded-lg bg-primary/20 dark:bg-primary/30 text-gray-900 dark:text-gray-100">
            grid_view
          </span>
          <span className="material-symbols-outlined p-2 rounded-lg">
            view_list
          </span>
        </div>
      </div>
      {/* Item Cards Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 py-2">
        {loading ? (
          <div className="col-span-2 text-center py-8">Loading menu...</div>
        ) : error ? (
          <div className="col-span-2 text-center text-red-500 py-8">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            No items found for your shop.
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-gray-800/50 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="relative">
                {item.image_url ? (
                  <img
                    className="aspect-square w-full object-cover"
                    alt={item.name}
                    src={item.image_url}
                  />
                ) : (
                  <div className="aspect-square w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500">
                      image_not_supported
                    </span>
                  </div>
                )}
                <button className="absolute top-2 right-2 flex items-center justify-center size-8 rounded-full bg-black/40 text-white backdrop-blur-sm">
                  <span className="material-symbols-outlined text-base">
                    edit
                  </span>
                </button>
              </div>
              <div className="p-3 flex flex-col gap-2 flex-1">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.price ? `$${item.price}` : ""}
                </p>
                <div className="flex-1"></div>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Quantity:
                  </span>
                  <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Empty State Example (commented out) */}
      {/*
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">
        <span className="material-symbols-outlined text-7xl text-gray-400 dark:text-gray-600">restaurant_menu</span>
        <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-gray-100">Your menu is empty</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Add your first item or scan a paper menu to get started.</p>
      </div>
      */}
      <div className="h-10"></div>
    </div>
  );
}
