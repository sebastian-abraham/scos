import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAuthHeaders } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  console.log("Current user in Profile:", user);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const headers = await getAuthHeaders();
      headers["Content-Type"] = "application/json";
      const [firstName, ...rest] = form.fullname.trim().split(" ");
      const lastName = rest.join(" ");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v1/users/${user.id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            firstName,
            lastName,
            email: form.email,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setUser({ ...user, ...updated });
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.message || "Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // Ignore firebase signout errors
    }
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        {/* Profile image URL field removed */}
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded font-bold"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded font-bold"
      >
        Logout
      </button>
    </div>
  );
}
