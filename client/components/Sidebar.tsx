"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import API from "@/lib/api";
import { useSearch } from "@/context/SearchContext";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { search, refreshKey } = useSearch();

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await API.get(`/projects?search=${search}&limit=100`);
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, refreshKey]);

  return (
    <div className="h-full flex flex-col">

      {/* ── Brand / Nav ── */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <p className="text-[10px] font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-2">
          Navigation
        </p>
        <div
          onClick={() => router.push("/dashboard")}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors
            ${
              pathname === "/dashboard"
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }
          `}
        >
          <span>🗂</span>
          Dashboard
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 border-t border-gray-100 dark:border-gray-800" />

      {/* ── Projects List ── */}
      <div className="flex-1 flex flex-col min-h-0 px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <p className="text-[10px] font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase">
            Projects
          </p>
          <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full font-medium">
            {projects.length}
          </span>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-0.5
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-gray-200
          [&::-webkit-scrollbar-thumb]:rounded-full
          dark:[&::-webkit-scrollbar-thumb]:bg-gray-700
        ">
          {projects.length === 0 && (
            <p className="text-xs text-gray-400 px-2 py-2">No projects found</p>
          )}

          {projects.map((project: any) => {
            const isActive = pathname.includes(project._id);
            return (
              <div
                key={project._id}
                onClick={() => router.push(`/dashboard/${project._id}`)}
                className={`px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                  ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <p className="text-sm font-medium truncate leading-tight">
                  {project.name}
                </p>
                <p className={`text-[11px] truncate mt-0.5 ${isActive ? "opacity-70" : "text-gray-400 dark:text-gray-500"}`}>
                  {project.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
