import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../utils/auth";

const ManageShops = () => {
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState("");
  const [actionsOpen, setActionsOpen] = useState(null); // shop id for which actions menu is open
  const [confirmDelete, setConfirmDelete] = useState(null); // shop id for which delete modal is open
  const [loading, setLoading] = useState(false);
  // Edit shop modal state
  const [showEditShop, setShowEditShop] = useState(false);
  const [editShopForm, setEditShopForm] = useState({
    id: null,
    name: "",
    location: "",
    image: null,
    openTime: "09:00",
    closeTime: "17:00",
    shopkeeperEmail: "",
  });
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editShopkeepers, setEditShopkeepers] = useState([]);
  const [editShopkeepersLoading, setEditShopkeepersLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
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
        // Attach imageUrl for each shop if shop_image exists
        const shopsArr = (Array.isArray(data) ? data : data.shops || []).map(
          (shop) => {
            // Extract shopkeeper details if present
            let shopkeeperName = "-";
            let shopkeeperEmail = "";
            if (shop.shopkeeper) {
              const fname = shop.shopkeeper.firstname || "";
              const lname = shop.shopkeeper.lastname || "";
              shopkeeperName =
                (fname + " " + lname).trim() || shop.shopkeeper.email || "-";
              shopkeeperEmail = shop.shopkeeper.email || "";
            }
            return {
              ...shop,
              shopkeeperName,
              shopkeeperEmail,
              imageUrl:
                shop.shop_image !== undefined && shop.shop_image !== null
                  ? `${import.meta.env.VITE_BACKEND_URL}/v1/shops/${
                      shop.id
                    }/image`
                  : undefined,
            };
          }
        );
        setShops(shopsArr);
        console.log(shopsArr);
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
        `${import.meta.env.VITE_BACKEND_URL}/v1/shops/${shop.id}`,
        {
          method: "PUT",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !shop.is_active }),
        }
      );
      if (!res.ok) throw new Error("Failed to update shop");
      setShops((prev) =>
        prev.map((s) =>
          s.id === shop.id ? { ...s, is_active: !s.is_active } : s
        )
      );
    } catch (e) {
      console.log();
    }
  };

  // --- Edit Shop Handlers (move to top-level scope) ---
  const handleEditShop = async (shop) => {
    setEditShopForm({
      id: shop.id,
      name: shop.name || "",
      location: shop.location || "",
      image: null,
      openTime: shop.open_time || shop.openTime || "09:00",
      closeTime: shop.close_time || shop.closeTime || "17:00",
      shopkeeperEmail:
        (shop.shopkeeper && shop.shopkeeper.email) ||
        shop.shopkeeperEmail ||
        shop.shopkeeper_email ||
        "",
    });
    setEditImagePreview(shop.imageUrl || null);
    setEditError("");
    setShowEditShop(true);
    setEditShopkeepersLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/users`, {
        headers,
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      const keepers = (Array.isArray(data) ? data : data.users || []).filter(
        (u) => (u.role || "").toLowerCase() === "shopkeeper"
      );
      setEditShopkeepers(keepers);
    } catch (e) {
      setEditShopkeepers([]);
    } finally {
      setEditShopkeepersLoading(false);
    }
  };
  const handleEditInput = (e) => {
    const { name, value } = e.target;
    setEditShopForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditShopForm((prev) => ({ ...prev, image: file }));
      setEditImagePreview(URL.createObjectURL(file));
    }
  };
  const handleEditDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setEditShopForm((prev) => ({ ...prev, image: file }));
      setEditImagePreview(URL.createObjectURL(file));
    }
  };
  const handleEditDragOver = (e) => {
    e.preventDefault();
  };
  const closeEditShop = () => {
    setShowEditShop(false);
    setEditError("");
    setEditImagePreview(null);
    setEditShopForm({
      id: null,
      name: "",
      location: "",
      image: null,
      openTime: "09:00",
      closeTime: "17:00",
      shopkeeperEmail: "",
    });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const headers = await getAuthHeaders();
      delete headers["Content-Type"];
      const formData = new FormData();
      formData.append("name", editShopForm.name);
      formData.append("location", editShopForm.location);
      formData.append("openTime", editShopForm.openTime);
      formData.append("closeTime", editShopForm.closeTime);
      formData.append("shopkeeperEmail", editShopForm.shopkeeperEmail);
      if (editShopForm.image) {
        formData.append("image", editShopForm.image);
      }
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v1/shops/${editShopForm.id}`,
        {
          method: "PUT",
          headers,
          body: formData,
        }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update shop");
      }
      // Update shop in UI
      const updatedShop = await res.json();
      setShops((prev) =>
        prev.map((s) =>
          s.id === updatedShop.id
            ? {
                ...s,
                ...updatedShop,
                imageUrl:
                  updatedShop.shop_image !== undefined &&
                  updatedShop.shop_image !== null
                    ? `${import.meta.env.VITE_BACKEND_URL}/v1/shops/${
                        updatedShop.id
                      }/image`
                    : undefined,
              }
            : s
        )
      );
      closeEditShop();
    } catch (err) {
      setEditError(err.message || "Error updating shop");
    } finally {
      setEditLoading(false);
    }
  };

  // --- End Edit Shop Handlers ---

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
        <div className="text-[#212529] dark:text-white flex size-12 shrink-0 items-center justify-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="focus:outline-none"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <span className="material-symbols-outlined text-2xl">
              arrow_back
            </span>
          </button>
        </div>
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
                className="flex flex-col gap-6 bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark shadow-sm min-h-[180px]"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl w-[96px] h-[96px] flex-shrink-0 border border-border-light dark:border-border-dark"
                      data-alt={shop.name + " shop logo"}
                      style={{
                        backgroundImage: shop.imageUrl
                          ? `url(${shop.imageUrl})`
                          : undefined,
                        backgroundColor: !shop.imageUrl ? "#eee" : undefined,
                      }}
                    ></div>
                    <div className="flex flex-1 flex-col justify-center gap-2 min-h-[96px]">
                      <p className="text-lg font-semibold leading-tight text-text-light dark:text-text-dark">
                        {shop.name}
                      </p>
                      <p className="text-base font-normal text-muted-light dark:text-muted-dark">
                        {shop.location}
                      </p>
                      <p className="text-base font-normal text-muted-light dark:text-muted-dark">
                        Assigned to: {shop.shopkeeperName || "-"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-muted-light dark:text-muted-dark h-10 w-10 flex items-center justify-center rounded-full bg-subtle-light dark:bg-subtle-dark"
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
                      onClick={() => handleEditShop(shop)}
                    >
                      <span className="material-symbols-outlined text-muted-light dark:text-muted-dark text-base">
                        edit
                      </span>
                      <span className="text-sm font-medium">Edit Details</span>
                    </button>
                    {/* Edit Shop Modal/Page */}
                    {showEditShop && (
                      <div className="fixed inset-0 z-50 flex flex-col">
                        {/* Overlay to block background and prevent scroll */}
                        <div
                          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                          style={{ zIndex: 0 }}
                        ></div>
                        {/* Modal content, scrollable */}
                        <div
                          className="relative flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto"
                          style={{ zIndex: 1 }}
                        >
                          <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-light dark:border-border-dark">
                            <div className="flex size-10 shrink-0 items-center justify-center">
                              <button onClick={closeEditShop} type="button">
                                <span className="material-symbols-outlined text-text-light dark:text-text-dark">
                                  arrow_back
                                </span>
                              </button>
                            </div>
                            <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                              Edit Shop
                            </h2>
                            <div className="size-10 shrink-0"></div>
                          </div>
                          <form
                            className="flex-1 px-4 py-6"
                            onSubmit={handleEditSubmit}
                          >
                            {/* Shop Details */}
                            <section className="flex flex-col gap-4 mb-8">
                              <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">
                                Shop Details
                              </h3>
                              {/* Shop Name */}
                              <label className="flex flex-col w-full">
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                  Shop Name
                                </p>
                                <input
                                  className="form-input h-14 p-[15px] text-base font-normal leading-normal"
                                  name="name"
                                  placeholder="Enter the shop's name"
                                  type="text"
                                  value={editShopForm.name}
                                  onChange={handleEditInput}
                                  required
                                />
                              </label>
                              {/* Shop Location */}
                              <label className="flex flex-col w-full">
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                  Shop Location
                                </p>
                                <input
                                  className="form-input h-14 p-[15px] text-base font-normal leading-normal"
                                  name="location"
                                  placeholder="e.g., Building A, 1st Floor"
                                  type="text"
                                  value={editShopForm.location}
                                  onChange={handleEditInput}
                                  required
                                />
                              </label>
                              {/* Shop Image Upload */}
                              <div>
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                  Shop Image
                                </p>
                                <div
                                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark/50 cursor-pointer"
                                  onDrop={handleEditDrop}
                                  onDragOver={handleEditDragOver}
                                  onClick={() =>
                                    document
                                      .getElementById("edit-shop-image-input")
                                      .click()
                                  }
                                >
                                  {editImagePreview ? (
                                    <img
                                      src={editImagePreview}
                                      alt="Preview"
                                      className="h-full object-contain"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <span className="material-symbols-outlined text-4xl text-placeholder-light dark:text-placeholder-dark">
                                        upload_file
                                      </span>
                                      <p className="mb-2 text-sm text-placeholder-light dark:text-placeholder-dark">
                                        <span className="font-semibold">
                                          Click to upload
                                        </span>{" "}
                                        or drag and drop
                                      </p>
                                      <p className="text-xs text-placeholder-light dark:text-placeholder-dark">
                                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                                      </p>
                                    </div>
                                  )}
                                  <input
                                    id="edit-shop-image-input"
                                    className="hidden"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImage}
                                  />
                                </div>
                              </div>
                            </section>
                            {/* Default Operating Hours */}
                            <section className="flex flex-col gap-4 mb-8">
                              <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">
                                Default Operating Hours
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                {/* Default Open Time */}
                                <label className="flex flex-col w-full">
                                  <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                    Open Time
                                  </p>
                                  <div className="relative">
                                    <input
                                      className="form-input h-14 p-[15px] text-base font-normal leading-normal w-full"
                                      name="openTime"
                                      type="time"
                                      value={editShopForm.openTime}
                                      onChange={handleEditInput}
                                      required
                                    />
                                  </div>
                                </label>
                                {/* Default Close Time */}
                                <label className="flex flex-col w-full">
                                  <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                    Close Time
                                  </p>
                                  <div className="relative">
                                    <input
                                      className="form-input h-14 p-[15px] text-base font-normal leading-normal w-full"
                                      name="closeTime"
                                      type="time"
                                      value={editShopForm.closeTime}
                                      onChange={handleEditInput}
                                      required
                                    />
                                  </div>
                                </label>
                              </div>
                            </section>
                            {/* Select Shopkeeper */}
                            <section className="flex flex-col gap-4 mb-8">
                              <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">
                                Assign Shopkeeper
                              </h3>
                              <label className="flex flex-col w-full">
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
                                  Shopkeeper
                                </p>
                                <select
                                  className="form-select h-14 p-[15px] text-base font-normal leading-normal"
                                  name="shopkeeperEmail"
                                  value={editShopForm.shopkeeperEmail}
                                  onChange={handleEditInput}
                                  required
                                  disabled={
                                    editShopkeepersLoading ||
                                    editShopkeepers.length === 0
                                  }
                                >
                                  <option value="" disabled>
                                    {editShopkeepersLoading
                                      ? "Loading shopkeepers..."
                                      : editShopkeepers.length === 0
                                      ? "No shopkeepers available"
                                      : "Select a shopkeeper"}
                                  </option>
                                  {editShopkeepers.map((u) => (
                                    <option key={u.id} value={u.email}>
                                      {u.firstname} {u.lastname} ({u.email})
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </section>
                            {/* Action Buttons */}
                            <div className="sticky bottom-0 bg-background-light dark:bg-background-dark p-4 border-t border-border-light dark:border-border-dark flex flex-col gap-3">
                              <button
                                className="flex items-center justify-center w-full h-14 rounded-xl bg-primary text-white text-base font-bold leading-normal"
                                type="submit"
                                disabled={editLoading}
                              >
                                {editLoading ? "Saving..." : "Save Changes"}
                              </button>
                              <button
                                className="flex items-center justify-center w-full h-14 rounded-xl bg-transparent text-primary dark:text-primary border border-primary text-base font-bold leading-normal"
                                type="button"
                                onClick={closeEditShop}
                              >
                                Cancel
                              </button>
                              {editError && (
                                <div className="text-red-500 text-center text-sm mt-2">
                                  {editError}
                                </div>
                              )}
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                    <button
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors"
                      onClick={() => handleToggleActive(shop)}
                    >
                      <span className="material-symbols-outlined text-muted-light dark:text-muted-dark text-base">
                        {shop.is_active ? "toggle_on" : "toggle_off"}
                      </span>
                      <span className="text-sm font-medium">
                        {shop.is_active ? "Deactivate Shop" : "Activate Shop"}
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
                      {shop.is_active ? (
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
                        shop.is_active
                          ? "text-primary"
                          : "text-muted-light dark:text-muted-dark"
                      }`}
                    >
                      {shop.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <label
                    className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 ${
                      shop.is_active
                        ? "bg-primary"
                        : "bg-subtle-light dark:bg-subtle-dark"
                    }`}
                  >
                    <div
                      className="h-full w-[27px] rounded-full bg-white transition-transform duration-200 ease-in-out"
                      style={{
                        boxShadow:
                          "rgba(0, 0, 0, 0.1) 0px 1px 3px, rgba(0, 0, 0, 0.06) 0px 1px 2px",
                        transform: shop.is_active
                          ? "translateX(20px)"
                          : "translateX(0px)",
                      }}
                    ></div>
                    <input
                      checked={!!shop.is_active}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-[calc(100%-2rem)] max-w-sm rounded-xl bg-white dark:bg-[#23272f] p-6 text-center shadow-xl flex flex-col gap-4">
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
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:bg-red-700"
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
