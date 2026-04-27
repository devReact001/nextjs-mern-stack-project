"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SearchProvider } from "@/context/SearchContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950">

        {/* Sidebar — fixed, scrolls internally */}
        <aside className="w-64 shrink-0 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-hidden">
          <Sidebar />
        </aside>

        {/* Right panel */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Header */}
          <header className="h-16 shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10">
            <Header />
          </header>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 dark:bg-gray-950 p-8
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:rounded-full
            dark:[&::-webkit-scrollbar-thumb]:bg-gray-700
          ">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>
    </SearchProvider>
  );
}
