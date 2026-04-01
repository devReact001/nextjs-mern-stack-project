"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });

      login(res.data.user, res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">

        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
          Login
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded-lg transition hover:opacity-90"
          >
            Login
          </button>
        </form>

        {/* Register link INSIDE card */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-black dark:text-white font-medium hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}