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
    <SearchProvider> {/* ✅ ONE shared context */}
      <div className="flex h-screen bg-gray-100 dark:bg-black">

        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
          <Sidebar />
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          
          {/* Header */}
          <header className="h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
            <Header />
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-black p-10">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}