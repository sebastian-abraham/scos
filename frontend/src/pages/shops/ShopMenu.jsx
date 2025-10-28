import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";

export default function ShopMenu() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState({
    order_id: null,
    total_amount: 0,
    items: [],
  });
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");

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

  // We'll use an overlay if shop is inactive
  const isClosed = shop && shop.is_active === false;

  // Add or update item quantity in cart
  const updateCartQuantity = async (item, newQty) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (newQty < 1) return; // Prevent 0 or negative
    setCartLoading(true);
    setCartError("");
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v1/cart/add`,
        {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: user.id,
            shop_id: shopId,
            item_id: item.id,
            quantity: newQty,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to update cart");
      setCart(data);
    } catch (e) {
      setCartError(e.message || "Could not update cart");
    } finally {
      setCartLoading(false);
    }
  };

  // Calculate cart item count
  const cartCount =
    cart.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0;

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
      <main
        className={`flex-grow px-4 ${
          isClosed ? "pointer-events-none opacity-50 grayscale" : ""
        }`}
      >
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
                      {/* Quantity controls or Add button */}
                      {(() => {
                        const cartItem = cart.items?.find(
                          (i) => i.item_id === item.id
                        );
                        if (cartItem) {
                          return (
                            <div className="flex items-center">
                              <div className="relative flex items-center w-24">
                                <button
                                  className="absolute left-0 h-full px-2 text-lg font-bold text-black dark:text-white bg-transparent border-none focus:outline-none"
                                  style={{ zIndex: 2 }}
                                  onClick={() =>
                                    updateCartQuantity(
                                      item,
                                      cartItem.quantity - 1
                                    )
                                  }
                                  disabled={
                                    cartLoading || cartItem.quantity <= 1
                                  }
                                  aria-label="Decrease quantity"
                                  tabIndex={-1}
                                >
                                  -
                                </button>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  min={0}
                                  className="w-full text-center font-bold text-base rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary pl-7 pr-7"
                                  value={cartItem.quantity}
                                  disabled={cartLoading}
                                  onChange={(e) => {
                                    let val = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    if (val === "") val = "0";
                                    setCart((prev) => ({
                                      ...prev,
                                      items: prev.items.map((i) =>
                                        i.item_id === item.id
                                          ? {
                                              ...i,
                                              quantity: parseInt(val, 10),
                                            }
                                          : i
                                      ),
                                    }));
                                  }}
                                  onBlur={(e) => {
                                    let val = e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    if (val === "" || val === "0") val = "0";
                                    const intVal = parseInt(val, 10);
                                    if (
                                      !isNaN(intVal) &&
                                      intVal !== cartItem.quantity
                                    ) {
                                      updateCartQuantity(item, intVal);
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    // Prevent up/down arrows
                                    if (
                                      e.key === "ArrowUp" ||
                                      e.key === "ArrowDown"
                                    ) {
                                      e.preventDefault();
                                    }
                                    // Enter triggers update
                                    if (e.key === "Enter") {
                                      let val = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      if (val === "" || val === "0") val = "0";
                                      const intVal = parseInt(val, 10);
                                      if (
                                        !isNaN(intVal) &&
                                        intVal !== cartItem.quantity
                                      ) {
                                        updateCartQuantity(item, intVal);
                                      }
                                    }
                                  }}
                                />
                                <button
                                  className="absolute right-0 h-full px-2 text-lg font-bold text-black dark:text-white bg-transparent border-none focus:outline-none"
                                  style={{ zIndex: 2 }}
                                  onClick={() =>
                                    updateCartQuantity(
                                      item,
                                      cartItem.quantity + 1
                                    )
                                  }
                                  disabled={cartLoading}
                                  aria-label="Increase quantity"
                                  tabIndex={-1}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <button
                              className="flex min-w-[84px] max-w-[480px] w-fit cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 bg-primary/20 dark:bg-primary/30 px-4 text-sm font-medium leading-normal text-black dark:text-white"
                              onClick={() => updateCartQuantity(item, 1)}
                              disabled={cartLoading}
                            >
                              <span className="material-symbols-outlined text-lg mr-1">
                                add_circle
                              </span>
                              <span className="truncate">
                                {cartLoading ? "Adding..." : "Add"}
                              </span>
                            </button>
                          );
                        }
                      })()}
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
            {cartError && (
              <div className="text-center text-red-500 py-2">{cartError}</div>
            )}
          </>
        )}
      </main>
      {/* Sticky Footer / FAB */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent">
        <div className="max-w-2xl mx-auto">
          <button
            className="flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-xl bg-primary h-14 px-5 text-black shadow-lg"
            disabled={cartCount === 0}
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-black/10 text-sm font-bold">
                {cartCount}
              </span>
              <span className="font-bold text-base">View Cart</span>
            </div>
            <span className="font-bold text-base">
              ${Number(cart.total_amount || 0).toFixed(2)}
            </span>
          </button>
        </div>
      </div>
      {/* Overlay for closed shop */}
      {isClosed && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white/90 dark:bg-background-dark/90 rounded-xl px-8 py-10 flex flex-col items-center shadow-2xl">
            <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">
              Shop is Closed
            </h1>
            <button
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-lg"
              onClick={() => navigate("/")}
            >
              Return Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
