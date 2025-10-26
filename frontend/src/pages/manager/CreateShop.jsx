import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../utils/auth";

const CreateShop = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    location: "",
    image: null,
    openTime: "09:00",
    closeTime: "17:00",
    shopkeeperEmail: "",
  });
  const [shopkeepers, setShopkeepers] = useState([]);
  const [shopkeepersLoading, setShopkeepersLoading] = useState(true);
  // Fetch shopkeepers for dropdown
  useEffect(() => {
    const fetchShopkeepers = async () => {
      setShopkeepersLoading(true);
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/v1/users`,
          { headers }
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        const keepers = (Array.isArray(data) ? data : data.users || []).filter(
          (u) => (u.role || "").toLowerCase() === "shopkeeper"
        );
        setShopkeepers(keepers);
      } catch (e) {
        setShopkeepers([]);
      } finally {
        setShopkeepersLoading(false);
      }
    };
    fetchShopkeepers();
  }, []);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const headers = await getAuthHeaders();
      // Remove content-type so browser sets it for FormData
      delete headers["Content-Type"];
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("location", form.location);
      formData.append("openTime", form.openTime);
      formData.append("closeTime", form.closeTime);
      formData.append("shopkeeperEmail", form.shopkeeperEmail);
      if (form.image) {
        formData.append("image", form.image);
      }
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/shops`, {
        method: "POST",
        headers,
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create shop");
      }
      setLoading(false);
      navigate(-1);
    } catch (err) {
      setError(err.message || "Error creating shop");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden font-display bg-background-light dark:bg-background-dark">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-light dark:border-border-dark">
        <div className="flex size-10 shrink-0 items-center justify-center">
          <button onClick={() => navigate(-1)} type="button">
            <span className="material-symbols-outlined text-text-light dark:text-text-dark">
              arrow_back
            </span>
          </button>
        </div>
        <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Create a New Shop
        </h2>
        <div className="size-10 shrink-0"></div>
      </div>
      <form className="flex-1 px-4 py-6" onSubmit={handleSubmit}>
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
              value={form.name}
              onChange={handleInput}
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
              value={form.location}
              onChange={handleInput}
              required
            />
          </label>
          {/* Shop Description removed */}
          {/* Shop Image Upload */}
          <div>
            <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
              Shop Image
            </p>
            <div
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark/50 cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() =>
                document.getElementById("shop-image-input").click()
              }
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="material-symbols-outlined text-4xl text-placeholder-light dark:text-placeholder-dark">
                    upload_file
                  </span>
                  <p className="mb-2 text-sm text-placeholder-light dark:text-placeholder-dark">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-placeholder-light dark:text-placeholder-dark">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
              )}
              <input
                id="shop-image-input"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleImage}
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
                  value={form.openTime}
                  onChange={handleInput}
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
                  value={form.closeTime}
                  onChange={handleInput}
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
              value={form.shopkeeperEmail}
              onChange={handleInput}
              required
              disabled={shopkeepersLoading || shopkeepers.length === 0}
            >
              <option value="" disabled>
                {shopkeepersLoading
                  ? "Loading shopkeepers..."
                  : shopkeepers.length === 0
                  ? "No shopkeepers available"
                  : "Select a shopkeeper"}
              </option>
              {shopkeepers.map((u) => (
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
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & Create Shop"}
          </button>
          <button
            className="flex items-center justify-center w-full h-14 rounded-xl bg-transparent text-primary dark:text-primary border border-primary text-base font-bold leading-normal"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          {error && (
            <div className="text-red-500 text-center text-sm mt-2">{error}</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateShop;
