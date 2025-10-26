import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAuthHeaders } from "../../utils/auth";

// Users will be fetched from backend

const TABS = ["Shopkeeper", "Student", "Manager"];

const ManageUsers = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    fullname: "",
    email: "",
    role: "Student",
  });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    fullname: "",
    email: "",
    role: "Student",
  });
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState("");
  const [activeTab, setActiveTab] = useState("Student");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/v1/users`,
          { headers }
        );
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data); // support both {users:[]} and []
      } catch (err) {
        setError(err.message || "Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    // Only fetch if not loading auth
    if (!authLoading) fetchUsers();
  }, [user, authLoading]);

  const handleAddUser = () => {
    setAddUserForm({
      fullname: "",
      email: "",
      role: "Student",
    });
    setAddUserError("");
    setShowAddUser(true);
  };
  const closeAddUser = () => {
    setShowAddUser(false);
    setAddUserError("");
  };

  // Handle Add User form input
  const handleAddUserInput = (e) => {
    const { name, value } = e.target;
    setAddUserForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add User form submit
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError("");
    try {
      // Split fullname into firstname and lastname
      const { fullname, email, role } = addUserForm;
      let firstname = "";
      let lastname = "";
      if (fullname.trim().includes(" ")) {
        const parts = fullname.trim().split(" ");
        firstname = parts[0];
        lastname = parts.slice(1).join(" ");
      } else {
        firstname = fullname.trim();
        lastname = "";
      }
      const body = { firstname, lastname, email, role: role.toLowerCase() };
      const headers = await getAuthHeaders();
      headers["Content-Type"] = "application/json";
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/users`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to add user");
      }
      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      closeAddUser();
    } catch (err) {
      setAddUserError(err.message || "Error adding user");
    } finally {
      setAddUserLoading(false);
    }
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Handle Edit User
  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditUserForm({
      fullname: (
        (user.firstname || "") + (user.lastname ? " " + user.lastname : "")
      ).trim(),
      email: user.email || "",
      role: user.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
        : "Student",
    });
    setEditUserError("");
    setShowEditUser(true);
  };
  const closeEditUser = () => {
    setShowEditUser(false);
    setEditUserError("");
    setSelectedUser(null);
  };
  const handleEditUserInput = (e) => {
    const { name, value } = e.target;
    setEditUserForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setEditUserLoading(true);
    setEditUserError("");
    try {
      // Split fullname
      const { fullname, email, role } = editUserForm;
      let firstname = "";
      let lastname = "";
      if (fullname.trim().includes(" ")) {
        const parts = fullname.trim().split(" ");
        firstname = parts[0];
        lastname = parts.slice(1).join(" ");
      } else {
        firstname = fullname.trim();
        lastname = "";
      }
      const body = { firstname, lastname, email, role: role.toLowerCase() };
      const headers = await getAuthHeaders();
      headers["Content-Type"] = "application/json";
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v1/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update user");
      }
      const updatedUser = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      closeEditUser();
    } catch (err) {
      setEditUserError(err.message || "Error updating user");
    } finally {
      setEditUserLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/v1/users/${selectedUser.id}`,
        {
          method: "DELETE",
          headers,
        }
      );
      if (!res.ok) throw new Error("Failed to delete user");
      // Remove user from UI
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      closeModal();
    } catch (err) {
      alert(err.message || "Error deleting user");
    }
  };

  const filteredUsers = users.filter(
    (u) => (u.role || "").toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display">
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 w-full bg-background-light dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4 pb-2 justify-between">
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
          <h1 className="text-[#212529] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Manage Users
          </h1>
          <div className="flex size-12 shrink-0 items-center justify-center">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary"
              onClick={handleAddUser}
            >
              <span className="material-symbols-outlined text-2xl">add</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {/* Tabs */}
        <nav className="pb-3 border-b border-[#DEE2E6] dark:border-gray-700">
          <div className="flex px-4 gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 px-2 ${
                  activeTab === tab
                    ? "border-b-primary text-[#212529] dark:text-white border-b-[3px] font-bold"
                    : "border-b-transparent text-gray-500 dark:text-gray-400"
                }`}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab(tab)}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                  {tab +
                    (tab === "Shopkeeper" ? "s" : tab === "Student" ? "s" : "")}
                </p>
              </button>
            ))}
          </div>
        </nav>
        {/* Search Bar */}
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-gray-500 dark:text-gray-400 flex border border-r-0 border-[#DEE2E6] dark:border-gray-700 bg-white dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#212529] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-l-0 border-[#DEE2E6] dark:border-gray-700 bg-white dark:bg-gray-800 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 rounded-l-none pl-2 text-base font-normal leading-normal"
                placeholder="Search by name or email"
                value=""
                readOnly
              />
            </div>
          </label>
        </div>
        {/* Card List */}
        <div className="px-4 md:px-8">
          {authLoading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 col-span-full">
              Checking authentication...
            </div>
          ) : loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 col-span-full">
              Loading users...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8 col-span-full">
              {error}
            </div>
          ) : !user ? (
            <div className="text-center text-red-500 py-8 col-span-full">
              You must be logged in to view users.
            </div>
          ) : (
            <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8 col-span-full">
                  No users found.
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-[#DEE2E6] dark:border-gray-700 shadow-sm p-4 flex flex-col justify-between h-full"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        className="h-16 w-16 rounded-full object-cover"
                        src={
                          user.imageurl && user.imageurl.trim()
                            ? user.imageurl
                            : "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(
                                (user.firstname || "") +
                                  " " +
                                  (user.lastname || "")
                              ) +
                              "&background=random"
                        }
                        alt={user.firstname + " " + user.lastname}
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-[#212529] dark:text-white">
                          {user.firstname} {user.lastname}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                          <span>ID: {user.id}</span>
                          <span>•</span>
                          <span>
                            Created:{" "}
                            {user.created_at
                              ? new Date(user.created_at).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 justify-start">
                      <button
                        className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/30"
                        onClick={() => handleEdit(user)}
                      >
                        <span className="material-symbols-outlined text-base">
                          edit
                        </span>
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-[#DC3545] hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60"
                        onClick={() => handleDelete(user)}
                      >
                        <span className="material-symbols-outlined text-base">
                          delete
                        </span>
                        Delete
                      </button>
                    </div>
                    {/* Edit User Modal */}
                    {showEditUser && (
                      <div
                        className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col"
                        id="edit-user-page"
                      >
                        <header className="sticky top-0 z-20 w-full bg-background-light dark:bg-background-dark/80 backdrop-blur-sm">
                          <div className="flex items-center p-4 justify-between">
                            <div className="text-[#212529] dark:text-white flex size-12 shrink-0 items-center justify-center">
                              <span
                                className="material-symbols-outlined text-2xl"
                                onClick={closeEditUser}
                                style={{ cursor: "pointer" }}
                              >
                                arrow_back
                              </span>
                            </div>
                            <h1 className="text-[#212529] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                              Edit User
                            </h1>
                            <div className="flex size-12 shrink-0 items-center"></div>
                          </div>
                        </header>
                        <main className="flex-grow p-4 space-y-6">
                          <form
                            className="space-y-6"
                            onSubmit={handleEditUserSubmit}
                          >
                            <div className="space-y-2">
                              <label
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                htmlFor="email-edit"
                              >
                                Email
                              </label>
                              <input
                                className="form-input block w-full rounded-lg border-[#DEE2E6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#212529] dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                                id="email-edit"
                                name="email"
                                placeholder="Enter user's email"
                                type="email"
                                value={editUserForm.email}
                                onChange={handleEditUserInput}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                htmlFor="fullname-edit"
                              >
                                Full Name
                              </label>
                              <input
                                className="form-input block w-full rounded-lg border-[#DEE2E6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#212529] dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                                id="fullname-edit"
                                name="fullname"
                                placeholder="Enter user's full name"
                                type="text"
                                value={editUserForm.fullname}
                                onChange={handleEditUserInput}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                htmlFor="role-edit"
                              >
                                Role
                              </label>
                              <select
                                className="form-select block w-full rounded-lg border-[#DEE2E6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#212529] dark:text-white focus:border-primary focus:ring-primary"
                                id="role-edit"
                                name="role"
                                value={editUserForm.role}
                                onChange={handleEditUserInput}
                                required
                              >
                                <option value="Student">Student</option>
                                <option value="Shopkeeper">Shopkeeper</option>
                                <option value="Manager">Manager</option>
                              </select>
                            </div>
                            {editUserError && (
                              <div className="text-red-500 text-sm text-center">
                                {editUserError}
                              </div>
                            )}
                            <div className="pt-4">
                              <button
                                className="w-full rounded-lg bg-primary px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-primary/90 disabled:opacity-60"
                                type="submit"
                                disabled={editUserLoading}
                              >
                                {editUserLoading ? "Saving..." : "Save Changes"}
                              </button>
                            </div>
                          </form>
                        </main>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="h-5"></div>
      </main>

      {/* Add User Modal/Page (UI only, not functional) */}
      {showAddUser && (
        <div
          className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col"
          id="add-user-page"
        >
          <header className="sticky top-0 z-20 w-full bg-background-light dark:bg-background-dark/80 backdrop-blur-sm">
            <div className="flex items-center p-4 justify-between">
              <div className="text-[#212529] dark:text-white flex size-12 shrink-0 items-center justify-center">
                <span
                  className="material-symbols-outlined text-2xl"
                  onClick={closeAddUser}
                  style={{ cursor: "pointer" }}
                >
                  arrow_back
                </span>
              </div>
              <h1 className="text-[#212529] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                Add New User
              </h1>
              <div className="flex size-12 shrink-0 items-center"></div>
            </div>
          </header>
          <main className="flex-grow p-4 space-y-6">
            <form className="space-y-6" onSubmit={handleAddUserSubmit}>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="form-input block w-full rounded-lg border-[#DEE2E6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#212529] dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                  id="email"
                  name="email"
                  placeholder="Enter user's email"
                  type="email"
                  value={addUserForm.email}
                  onChange={handleAddUserInput}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="fullname"
                >
                  Full Name
                </label>
                <input
                  className="form-input block w-full rounded-lg border-[#DEE2E6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#212529] dark:text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                  id="fullname"
                  name="fullname"
                  placeholder="Enter user's full name"
                  type="text"
                  value={addUserForm.fullname}
                  onChange={handleAddUserInput}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="role"
                >
                  Role
                </label>
                <select
                  className="form-select block w-full rounded-lg border-[#DEE2E6] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#212529] dark:text-white focus:border-primary focus:ring-primary"
                  id="role"
                  name="role"
                  value={addUserForm.role}
                  onChange={handleAddUserInput}
                  required
                >
                  <option value="Student">Student</option>
                  <option value="Shopkeeper">Shopkeeper</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              {addUserError && (
                <div className="text-red-500 text-sm text-center">
                  {addUserError}
                </div>
              )}
              <div className="pt-4">
                <button
                  className="w-full rounded-lg bg-primary px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-primary/90 disabled:opacity-60"
                  type="submit"
                  disabled={addUserLoading}
                >
                  {addUserLoading ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </main>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-background-light dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm m-4 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#DC3545]/10">
              <span className="material-symbols-outlined text-[#DC3545] text-3xl">
                warning
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[#212529] dark:text-white mt-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Are you sure you want to delete this user's account? This action
              cannot be easily undone.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="flex-1 rounded-lg border border-[#DEE2E6] dark:border-gray-600 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-lg bg-[#DC3545] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#DC3545]/90"
                onClick={handleConfirmDelete}
                disabled={!selectedUser}
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
