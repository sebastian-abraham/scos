import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../utils/auth";

const ManageShops = () => {
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");
  const [actionsOpen, setActionsOpen] = useState(null); // shop id for which actions menu is open
  const [confirmDelete, setConfirmDelete] = useState(null); // shop id for which delete modal is open
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/v1/shops`,
          { headers }
        );
        if (!res.ok) throw new Error("Failed to fetch shops");
        const data = await res.json();
        // Attach imageUrl if backend serves images at /v1/shops/:id/image
        const shopsArr = (Array.isArray(data) ? data : data.shops || []).map(
          (shop) => ({
            ...shop,
            imageUrl: shop.hasImage
              ? `${import.meta.env.VITE_BACKEND_URL}/v1/shops/${shop.id}/image`
              : undefined,
          })
        );
        setShops(shopsArr);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const filteredShops = useMemo(() => {
    if (!search) return shops;
    return shops.filter(
      (shop) =>
        (shop.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (shop.location || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [shops, search]);

  const handleToggleActive = async (shop) => {
    try {
      const headers = await getAuthHeaders();
      // PATCH /v1/shops/:id/active { active: true/false }
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v1/shops/${shop.id}/active`,
        {
          method: "PATCH",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ active: !shop.active }),
        }
      );
      if (!res.ok) throw new Error("Failed to update shop");
      setShops((prev) =>
        prev.map((s) => (s.id === shop.id ? { ...s, active: !s.active } : s))
      );
    } catch (e) {
      // handle error
    }
  };

  const handleDelete = async (shop) => {
    try {
      const headers = await getAuthHeaders();
      // DELETE /v1/shops/:id
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v1/shops/${shop.id}`,
        {
          method: "DELETE",
          headers,
        }
      );
      if (!res.ok) throw new Error("Failed to delete shop");
      setShops((prev) => prev.filter((s) => s.id !== shop.id));
      setConfirmDelete(null);
    } catch (e) {
      // handle error
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 pb-3 justify-between border-b border-border-light dark:border-border-dark">
        <div className="flex size-12 shrink-0 items-center justify-start"></div>
        <h1 className="text-lg font-bold flex-1 text-center">All Shops</h1>
        <div className="flex size-12 shrink-0 items-center justify-end"></div>
      </header>
      <main className="flex-1 pb-24">
        {/* Search Bar */}
        <div className="px-4 py-3 bg-background-light dark:bg-background-dark">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-muted-light dark:text-muted-dark flex border-none bg-subtle-light dark:bg-subtle-dark items-center justify-center pl-4 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-subtle-light dark:bg-subtle-dark focus:border-none h-full placeholder:text-muted-light dark:placeholder:text-muted-dark px-4 rounded-l-none border-l-0 pl-2 text-base font-normal"
                placeholder="Search by shop name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </label>
        </div>
        {/* Shop List */}
        <div className="flex flex-col gap-3 p-4">
          {loading ? (
            <div className="text-center text-muted-light dark:text-muted-dark py-8">
              Loading...
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="text-center text-muted-light dark:text-muted-dark py-8">
              No shops found.
            </div>
          ) : (
            filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="flex flex-col gap-4 bg-card-light dark:bg-card-dark rounded-xl p-4 border border-border-light dark:border-border-dark shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[56px] flex-shrink-0"
                      data-alt={shop.name + " shop logo"}
                      style={{
                        backgroundImage: shop.imageUrl
                          ? `url(${shop.imageUrl})`
                          : undefined,
                        backgroundColor: !shop.imageUrl ? "#eee" : undefined,
                      }}
                    ></div>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                      <p className="text-base font-semibold leading-tight text-text-light dark:text-text-dark">
                        {shop.name}
                      </p>
                      <p className="text-sm font-normal text-muted-light dark:text-muted-dark">
                        {shop.location}
                      </p>
                      <p className="text-sm font-normal text-muted-light dark:text-muted-dark">
                        Assigned to: {shop.shopkeeperName || "-"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-muted-light dark:text-muted-dark h-8 w-8 flex items-center justify-center rounded-full bg-subtle-light dark:bg-subtle-dark"
                    onClick={() =>
                      setActionsOpen(actionsOpen === shop.id ? null : shop.id)
                    }
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                {/* Actions Menu */}
                {actionsOpen === shop.id && (
                  <div className="flex flex-col border-t border-border-light dark:border-border-dark pt-3 gap-1">
                    <button
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors"
                      onClick={() => navigate(`/manager/shops/edit/${shop.id}`)}
                    >
                      <span className="material-symbols-outlined text-muted-light dark:text-muted-dark text-base">
                        edit
                      </span>
                      <span className="text-sm font-medium">Edit Details</span>
                    </button>
                    <button
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors"
                      onClick={() => handleToggleActive(shop)}
                    >
                      <span className="material-symbols-outlined text-muted-light dark:text-muted-dark text-base">
                        {shop.active ? "toggle_off" : "toggle_on"}
                      </span>
                      <span className="text-sm font-medium">
                        {shop.active ? "Deactivate Shop" : "Activate Shop"}
                      </span>
                    </button>
                    <button
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-danger/10 transition-colors"
                      onClick={() => setConfirmDelete(shop.id)}
                    >
                      <span className="material-symbols-outlined text-danger text-base">
                        delete
                      </span>
                      <span className="text-sm font-medium text-danger">
                        Delete Shop
                      </span>
                    </button>
                  </div>
                )}
                {/* Status and Toggle */}
                <div className="flex items-center justify-between border-t border-border-light dark:border-border-dark pt-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {shop.active ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </>
                      ) : (
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-light"></span>
                      )}
                    </span>
                    <p
                      className={`text-sm font-medium ${
                        shop.active
                          ? "text-primary"
                          : "text-muted-light dark:text-muted-dark"
                      }`}
                    >
                      {shop.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <label
                    className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 ${
                      shop.active
                        ? "bg-primary"
                        : "bg-subtle-light dark:bg-subtle-dark"
                    }`}
                  >
                    <div
                      className="h-full w-[27px] rounded-full bg-white transition-transform duration-200 ease-in-out"
                      style={{
                        boxShadow:
                          "rgba(0, 0, 0, 0.1) 0px 1px 3px, rgba(0, 0, 0, 0.06) 0px 1px 2px",
                      }}
                    ></div>
                    <input
                      checked={!!shop.active}
                      className="invisible absolute"
                      type="checkbox"
                      onChange={() => handleToggleActive(shop)}
                    />
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark"
          onClick={() => navigate("/manager/shops/create")}
        >
          <span className="material-symbols-outlined !text-3xl">add</span>
        </button>
      </div>
      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[calc(100%-2rem)] max-w-sm rounded-xl bg-card-light dark:bg-card-dark p-6 text-center shadow-xl flex flex-col gap-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
              <span className="material-symbols-outlined text-danger !text-3xl">
                delete_forever
              </span>
            </div>
            <h3 className="text-lg font-bold">Are you sure?</h3>
            <p className="text-sm text-muted-light dark:text-muted-dark">
              Deleting "
              {shops.find((s) => s.id === confirmDelete)?.name || "this shop"}"
              is permanent and cannot be undone. All associated data will be
              lost.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                className="rounded-lg bg-subtle-light dark:bg-subtle-dark px-4 py-2.5 text-sm font-semibold text-text-light dark:text-text-dark transition hover:opacity-80"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-80"
                onClick={() =>
                  handleDelete(shops.find((s) => s.id === confirmDelete))
                }
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageShops;
