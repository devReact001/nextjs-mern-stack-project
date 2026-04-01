"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import API from "@/lib/api";

interface Project {
  _id: string;
  name: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path: string) =>
    pathname === path
      ? "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900";

  return (
    <div className="h-full flex flex-col p-6">
      {/* Logo */}

      <div className="flex items-center gap-2">
        <span className="text-lg">🚀</span>
        <span className="text-lg font-semibold text-gray-900 dark:text-white transition">
          ProjectApp
        </span>
      </div>
      {/* Dashboard Link */}
      <nav className="space-y-2 mb-8">
        <Link
          href="/dashboard"
          className={`block px-4 py-2 rounded-lg transition ${isActive(
            "/dashboard",
          )}`}
        >
          Dashboard
        </Link>
      </nav>

      {/* Projects */}
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
          Projects
        </p>

        <div className="space-y-2">
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/dashboard/${project._id}`}
              className={`block px-4 py-2 rounded-lg text-sm transition ${
                pathname === `/dashboard/${project._id}`
                  ? "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
              }`}
            >
              {project.name}
            </Link>
          ))}

          {projects.length === 0 && (
            <p className="text-xs text-gray-400">No projects</p>
          )}
        </div>
      </div>
    </div>
  );
}
