"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

interface Project {
  _id: string;
  name: string;
  description?: string;
}

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // ✨ Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) fetchProjects();
  }, [user, loading]);

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
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

  // ✨ Update Project
  const updateProject = async (id: string) => {
    const res = await API.put(`/projects/${id}`, {
      name: editName,
      description: editDescription,
    });

    setProjects(
      projects.map((p) => (p._id === id ? res.data : p))
    );

    setEditingId(null);
  };

  if (loading || !user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10">

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center transition-colors duration-300">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Project Dashboard
        </h1>
      </div>

      {/* Create Project */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
        <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Create New Project
        </h2>

        <form className="grid md:grid-cols-3 gap-4" onSubmit={createProject}>
          <input
            type="text"
            placeholder="Project Name"
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-gray-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-gray-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 transition hover:opacity-90">
            Add Project
          </button>
        </form>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Your Projects
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => {
                if (!editingId)
                  router.push(`/dashboard/${project._id}`);
              }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              {editingId === project._id ? (
                <>
                  <input
                    className="w-full mb-2 p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    className="w-full mb-3 p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                    value={editDescription}
                    onChange={(e) =>
                      setEditDescription(e.target.value)
                    }
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
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {project.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(project._id);
                        setEditName(project.name);
                        setEditDescription(
                          project.description || ""
                        );
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
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 mt-6">
            No projects yet.
          </p>
        )}
      </div>
    </div>
  );
}