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

  const { search, setSearch } = useSearch();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // 🔁 debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔐 auth + initial fetch
  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) fetchProjects();
  }, [user, loading]);

  // 🔍 fetch on search change
  useEffect(() => {
    if (user) fetchProjects();
  }, [debouncedSearch, page]);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);

      const res = await API.get(
        `/projects?search=${debouncedSearch}&page=${page}&limit=3`,
      );

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
    if (!name) return;

    const res = await API.post("/projects", { name, description });
    setProjects([res.data, ...projects]);
    setName("");
    setDescription("");
  };

  const deleteProject = async (id: string) => {
    await API.delete(`/projects/${id}`);
    setProjects(projects.filter((p) => p._id !== id));
  };

  const updateProject = async (id: string) => {
    const res = await API.put(`/projects/${id}`, {
      name: editName,
      description: editDescription,
    });

    setProjects(projects.map((p) => (p._id === id ? res.data : p)));
    setEditingId(null);
  };

  if (loading || !user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-xl font-semibold">Project Dashboard</h1>
      </div>

      {/* Create Project */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="font-semibold mb-4">Create New Project</h2>

        <form className="grid md:grid-cols-3 gap-4" onSubmit={createProject}>
          <input
            type="text"
            placeholder="Project Name"
            className="border rounded-lg px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            className="border rounded-lg px-4 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="bg-black text-white rounded-lg px-4 py-2">
            Add Project
          </button>
        </form>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Your Projects</h2>

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border-2 border-black px-4 py-2 rounded-lg w-64 bg-white text-black mb-4"
        />

        {/* Loading */}
        {loadingProjects && <p>Loading...</p>}

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => {
                if (!editingId) router.push(`/dashboard/${project._id}`);
              }}
              className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition cursor-pointer"
            >
              {editingId === project._id ? (
                <>
                  <input
                    className="w-full mb-2 p-2 rounded bg-gray-100"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    className="w-full mb-3 p-2 rounded bg-gray-100"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProject(project._id);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <div>
                    {/* 🔥 highlight */}
                    <h3 className="font-semibold">
                      {project.name
                        .split(new RegExp(`(${debouncedSearch})`, "gi"))
                        .map((part, i) =>
                          part.toLowerCase() ===
                          debouncedSearch.toLowerCase() ? (
                            <span key={i} className="bg-yellow-200">
                              {part}
                            </span>
                          ) : (
                            part
                          ),
                        )}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      {project.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(project._id);
                        setEditName(project.name);
                        setEditDescription(project.description || "");
                      }}
                      className="text-blue-500 mt-3 text-sm"
                    >
                      Edit
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project._id);
                    }}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty */}
        {projects.length === 0 && !loadingProjects && (
          <p className="text-gray-500 mt-6">No matching projects found</p>
        )}
      </div>
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {pages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, pages))}
          disabled={page === pages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
