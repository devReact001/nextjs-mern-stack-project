"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";

interface Task {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
}

interface Project {
  _id: string;
  name: string;
  description?: string;
}

const STATUS_CONFIG = {
  "todo": { label: "Todo", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-100 dark:border-orange-900/40", dot: "bg-orange-400" },
  "in-progress": { label: "In Progress", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-100 dark:border-blue-900/40", dot: "bg-blue-400" },
  "done": { label: "Done", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-100 dark:border-green-900/40", dot: "bg-green-400" },
};

export default function ProjectTasksPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) {
      fetchTasks();
      fetchProject();
    }
  }, [user, loading]);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${projectId}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await API.post(`/tasks/${projectId}`, { title });
      setTasks([res.data, ...tasks]);
      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (id: string, status: Task["status"]) => {
    try {
      const res = await API.put(`/tasks/task/${id}`, { status });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskTitle = async (id: string) => {
    try {
      const res = await API.put(`/tasks/task/${id}`, { title: editTitle });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await API.delete(`/tasks/task/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) return null;

  const columns: Task["status"][] = ["todo", "in-progress", "done"];

  return (
    <div className="space-y-6">

      {/* ── Back ── */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition font-medium"
      >
        ← Back
      </button>

      {/* ── Project Header ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-1">
              Project
            </p>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {project?.name ?? "Loading..."}
            </h1>
            {project?.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex gap-3 text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-1">
            {columns.map((col) => (
              <div key={col} className="text-center">
                <div className={`text-base font-bold ${STATUS_CONFIG[col].color}`}>
                  {tasks.filter((t) => t.status === col).length}
                </div>
                <div className="capitalize">{STATUS_CONFIG[col].label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add Task ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
          Add New Task
        </h2>
        <form onSubmit={createTask} className="flex gap-3">
          <input
            type="text"
            placeholder="Task title..."
            className="flex-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition placeholder:text-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition shrink-0">
            Add
          </button>
        </form>
      </div>

      {/* ── Kanban Board ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((status) => {
          const cfg = STATUS_CONFIG[status];
          const colTasks = tasks.filter((t) => t.status === status);
          return (
            <div
              key={status}
              className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border}`}
            >
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <h3 className={`text-sm font-semibold ${cfg.color}`}>
                  {cfg.label}
                </h3>
                <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 font-medium">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {colTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {editingId === task._id ? (
                      <>
                        <input
                          className="w-full mb-3 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm border border-gray-200 dark:border-gray-600 outline-none"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateTaskTitle(task._id)}
                            className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-medium hover:opacity-80 transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium hover:opacity-80 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-3 leading-snug">
                          {task.title}
                        </p>

                        {/* Status pills */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {columns.map((col) => (
                            <button
                              key={col}
                              onClick={() => updateTaskStatus(task._id, col)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                                task.status === col
                                  ? `${STATUS_CONFIG[col].dot} bg-opacity-100 text-white` +
                                    (col === "todo" ? " bg-orange-400" : col === "in-progress" ? " bg-blue-400" : " bg-green-400")
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                              }`}
                            >
                              {STATUS_CONFIG[col].label}
                            </button>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <button
                            onClick={() => { setEditingId(task._id); setEditTitle(task.title); }}
                            className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTask(task._id)}
                            className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-300 dark:text-gray-600">
                    <p className="text-2xl mb-1">✓</p>
                    <p className="text-xs">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
