import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../utils/auth";

export default function ShopMenu() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShopAndItems = async () => {
      setLoading(true);
      setError("");
      try {
        const headers = await getAuthHeaders();
        const shopRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/v1/shops/${shopId}`,
          { headers }
        );
        if (!shopRes.ok) throw new Error("Failed to fetch shop");
        const shopData = await shopRes.json();
        setShop(shopData.shop || shopData);
        const itemsRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/v1/items?shop_id=${shopId}`,
          { headers }
        );
        if (!itemsRes.ok) throw new Error("Failed to fetch items");
        const itemsData = await itemsRes.json();
        setItems(Array.isArray(itemsData) ? itemsData : itemsData.items || []);
      } catch (e) {
        setError(e.message || "Could not load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchShopAndItems();
  }, [shopId]);

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden pb-24">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 p-4 pb-2 backdrop-blur-sm">
        <button
          className="flex size-12 shrink-0 items-center justify-start text-black dark:text-white"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="flex-1 text-lg font-bold leading-tight tracking-[-0.015em] text-center text-black dark:text-white">
          {shop ? shop.name : "Canteen Menu"}
        </h1>
        <div className="flex w-12 items-center justify-end">
          <button className="flex h-12 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent p-0 text-black dark:text-white">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
        </div>
      </div>
      <main className="flex-grow px-4">
        {loading ? (
          <div className="text-center py-8">Loading menu...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            {/* Section Header: Main Courses */}
            <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
              Menu
            </h2>
            {items.length === 0 ? (
              <div className="text-center py-8">No items found.</div>
            ) : (
              items.map((item, idx) => (
                <div className="mb-4" key={item.id || idx}>
                  <div className="flex items-stretch justify-between gap-4">
                    <div className="flex flex-[2_2_0px] flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-black dark:text-white text-base font-bold leading-tight">
                          {item.name}
                        </p>
                        <p className="text-black dark:text-white text-base font-bold pt-1">
                          {typeof item.price === "number"
                            ? `$${item.price.toFixed(2)}`
                            : typeof item.price === "string" &&
                              !isNaN(Number(item.price))
                            ? `$${Number(item.price).toFixed(2)}`
                            : "-"}
                        </p>
                      </div>
                      <button className="flex min-w-[84px] max-w-[480px] w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 bg-primary/20 dark:bg-primary/30 px-4 text-sm font-medium leading-normal text-black dark:text-white">
                        <span className="material-symbols-outlined text-lg mr-1">
                          add_circle
                        </span>
                        <span className="truncate">Add</span>
                      </button>
                    </div>
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-1"
                      data-alt={item.name}
                      style={{
                        backgroundImage: item.image_url
                          ? `url('${item.image_url}')`
                          : undefined,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </main>
      {/* Sticky Footer / FAB */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent">
        <div className="max-w-2xl mx-auto">
          <button className="flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-xl bg-primary h-14 px-5 text-black shadow-lg">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/10 text-sm font-bold">
                0
              </span>
              <span className="font-bold text-base">View Cart</span>
            </div>
            <span className="font-bold text-base">$0.00</span>
          </button>
        </div>
      </div>
    </div>
  );
}
