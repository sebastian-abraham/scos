import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/v1/orders/my`,
          { headers }
        );
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "Could not load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleConfirmOrder = async (orderId) => {
    setConfirming(true);
    try {
      const headers = {
        ...(await getAuthHeaders()),
        "Content-Type": "application/json",
      };
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v1/orders/${orderId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ order_status: "Progress" }),
        }
      );
      if (!res.ok) throw new Error("Failed to confirm order");
      // Refresh orders
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (e) {
      alert(e.message || "Could not confirm order");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      {/* Top App Bar */}
      <div className="flex items-center p-4 pb-2 justify-between bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <button
          className="text-[#0e1b0e] dark:text-white flex size-12 shrink-0 items-center justify-start"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-[#0e1b0e] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          My Orders
        </h2>
        <div className="size-12 shrink-0"></div>
      </div>
      <main className="flex-grow px-4">
        <h3 className="text-[#0e1b0e] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-4 pb-2">
          Order Summary
        </h3>
        {loading ? (
          <div className="text-center py-8 text-zinc-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">No orders found.</div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-4 space-y-4 mb-6"
            >
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                  Order #{order.id}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    order.order_status === "Pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : order.order_status === "Progress"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : order.order_status === "Ready"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : order.order_status === "Completed"
                      ? "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
                      : order.order_status === "Cancelled"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
                  }`}
                >
                  {order.order_status}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                  <p>Total</p>
                  <p>${Number(order.total_amount).toFixed(2)}</p>
                </div>
                {/* Add more order details if needed */}
              </div>
              {order.order_status === "Pending" && (
                <button
                  className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-transform transform active:scale-95 disabled:opacity-60"
                  onClick={() => handleConfirmOrder(order.id)}
                  disabled={confirming}
                >
                  {confirming ? "Confirming..." : "Confirm Order"}
                </button>
              )}
            </div>
          ))
        )}
      </main>
      <div className="p-4 bg-background-light dark:bg-background-dark sticky bottom-0">
        <button
          className="w-full text-zinc-600 dark:text-zinc-400 font-medium py-4 px-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 transition-colors"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
}
