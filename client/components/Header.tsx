"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <div className="h-full flex items-center justify-between px-10">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Workspace
      </h2>

      <div className="flex items-center gap-6">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition
            ${
              dark
                ? "border-white text-yellow-400"
                : "border-blue-500 text-blue-600"
            }
          `}
        >
          {dark ? "☀️" : "🌙"}
        </button>

        <span className="text-gray-600 dark:text-gray-400">
          {user?.name}
        </span>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black transition hover:opacity-90"
        >
          Logout
        </button>
      </div>
    </div>
  );
}