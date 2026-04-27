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
    <div className="h-full flex flex-col p-4 overflow-y-auto">

      {/* 🔥 NAVIGATION */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 uppercase mb-2">
          Navigation
        </p>

        <div
          onClick={() => router.push("/dashboard")}
          className={`p-3 rounded-lg cursor-pointer transition
            ${
              pathname === "/dashboard"
                ? "bg-black text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }
          `}
        >
          Dashboard
        </div>
      </div>

      {/* 🔥 PROJECTS SECTION */}
      <div className="flex-1 flex flex-col">

        <p className="text-xs text-gray-400 uppercase mb-2">
          Projects
        </p>

        <p className="text-sm text-gray-500 mb-3">
          {projects.length} projects
        </p>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2">

          {projects.length === 0 && (
            <p className="text-sm text-gray-400">
              No projects found
            </p>
          )}

          {projects.map((project: any) => {
            const isActive = pathname.includes(project._id);

            return (
              <div
                key={project._id}
                onClick={() => router.push(`/dashboard/${project._id}`)}
                className={`p-3 rounded-lg cursor-pointer transition
                  ${
                    isActive
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }
                `}
              >
                <p className="font-medium truncate">
                  {project.name}
                </p>

                <p className="text-xs opacity-70 truncate">
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