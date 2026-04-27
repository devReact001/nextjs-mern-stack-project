"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import API from "@/lib/api";

interface Project {
  _id: string;
  name: string;
  description?: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const { search, setSearch, triggerRefresh } = useSearch();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // auth + initial fetch
  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) fetchProjects();
  }, [user, loading]);

  // fetch on search/page change
  useEffect(() => {
    if (user) fetchProjects();
  }, [debouncedSearch, page]);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await API.get(`/projects?search=${debouncedSearch}&page=${page}&limit=3`);
      setProjects(res.data.data);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await API.post("/projects", { name, description });
      setProjects([res.data, ...projects]);
      setName("");
      setDescription("");
      triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id: string) => {
    await API.delete(`/projects/${id}`);
    setProjects(projects.filter((p) => p._id !== id));
    triggerRefresh();
  };

  const updateProject = async (id: string) => {
    const res = await API.put(`/projects/${id}`, {
      name: editName,
      description: editDescription,
    });
    setProjects(projects.map((p) => (p._id === id ? res.data : p)));
    setEditingId(null);
    triggerRefresh();
  };

  if (loading || !user) return null;

  return (
    <div className="space-y-8">

      {/* ── Create Project ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
          Create New Project
        </h2>
        <form onSubmit={createProject} className="grid md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Project Name"
            className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition placeholder:text-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition placeholder:text-gray-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="bg-black dark:bg-white text-white dark:text-black rounded-xl px-4 py-2.5 text-sm font-medium hover:opacity-90 transition">
            Add Project
          </button>
        </form>
      </div>

      {/* ── Projects Section ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">
            Your Projects
            <span className="ml-2 text-xs font-normal text-gray-400">({projects.length} shown)</span>
          </h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition placeholder:text-gray-400 w-56"
          />
        </div>

        {/* Loading */}
        {loadingProjects && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
            Loading...
          </div>
        )}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => { if (!editingId) router.push(`/dashboard/${project._id}`); }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 cursor-pointer group"
            >
              {editingId === project._id ? (
                <div onClick={(e) => e.stopPropagation()} className="space-y-2">
                  <input
                    className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm border border-gray-200 dark:border-gray-700 outline-none"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Project name"
                  />
                  <input
                    className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm border border-gray-200 dark:border-gray-700 outline-none"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => updateProject(project._id)}
                      className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-medium hover:opacity-80 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:opacity-80 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
                      {project.name
                        .split(new RegExp(`(${debouncedSearch})`, "gi"))
                        .map((part, i) =>
                          part.toLowerCase() === debouncedSearch.toLowerCase() && debouncedSearch ? (
                            <span key={i} className="bg-yellow-200 dark:bg-yellow-500/30 rounded px-0.5">{part}</span>
                          ) : part
                        )}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                      {project.description || <span className="italic opacity-50">No description</span>}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(project._id);
                        setEditName(project.name);
                        setEditDescription(project.description || "");
                      }}
                      className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteProject(project._id); }}
                      className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty */}
        {projects.length === 0 && !loadingProjects && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📂</p>
            <p className="text-sm">No projects found</p>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-3 pb-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {page} / {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, pages))}
            disabled={page === pages}
            className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
