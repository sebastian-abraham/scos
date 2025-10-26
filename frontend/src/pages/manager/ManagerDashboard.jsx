// ManagerDashboard.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

// Google Fonts and Material Symbols are expected to be loaded globally in index.html
// Tailwind CSS config is expected to be set up in the project

const stats = [
  {
    label: "Total Shops",
    icon: "storefront",
    value: 12,
  },
  {
    label: "Shopkeepers",
    icon: "group",
    value: 25,
  },
  {
    label: "Total Students",
    icon: "school",
    value: 850,
  },
  {
    label: "Today's Sales",
    icon: "payments",
    value: "$1,234",
    valueClass: "text-secondary",
  },
];

const ManagerDashboard = ({user}) => {
  const navigate = useNavigate();
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-text-primary-light dark:text-text-primary-dark">
      {/* Top App Bar */}
      <div className="sticky top-0 z-10 flex h-16 items-center border-b border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark px-4 justify-between">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-text-primary-light dark:text-text-primary-dark text-3xl">
            restaurant_menu
          </span>
          <h1 className="text-xl font-bold leading-tight tracking-tight">
            Canteen Manager
          </h1>
        </div>
        <div className="flex w-12 items-center justify-end">
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-card-light dark:bg-card-dark px-4 pt-2">
        <a
          className="border-b-2 border-primary px-4 py-3 text-sm font-semibold text-primary"
          href="#"
        >
          Dashboard
        </a>
        <a
          className="border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary"
          href="#"
        >
          Shops
        </a>
        <a
          className="border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary"
          href="#"
        >
          Users
        </a>
      </div>

      <main className="flex-1 p-4 md:p-6">
        {/* Headline Text */}
        <h2 className="tracking-light text-[28px] font-bold leading-tight px-0 pb-4 pt-2">
          Welcome back, {user.firstName} {user.lastName}!
        </h2>

        {/* Section Header */}
        <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-0 pb-3 pt-4 text-text-primary-light dark:text-text-primary-dark">
          Today's Overview
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2 rounded-lg p-4 shadow-sm bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  {stat.label}
                </p>
                <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
                  {stat.icon}
                </span>
              </div>
              <p
                className={`tracking-light text-3xl font-bold leading-tight text-text-primary-light dark:text-text-primary-dark ${
                  stat.valueClass || ""
                }`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Section Header for Quick Actions */}
        <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-0 pb-3 pt-8 text-text-primary-light dark:text-text-primary-dark">
          Quick Actions
        </h3>

        {/* Quick Action Buttons */}
        <div className="flex flex-col gap-4">
          <button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-primary px-6 py-4 text-base font-bold text-white shadow-sm transition-opacity hover:opacity-90">
            <span className="material-symbols-outlined">add_business</span>
            <span>Add New Shop</span>
          </button>
          <button
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-primary bg-transparent px-6 py-4 text-base font-bold text-primary shadow-sm transition-colors hover:bg-primary/10"
            onClick={() => navigate("/manager/users")}
          >
            <span className="material-symbols-outlined">manage_accounts</span>
            <span>Manage Users</span>
          </button>
        </div>
        <div className="h-10"></div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
