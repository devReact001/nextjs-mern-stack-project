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

export default function ProjectTasksPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  // ✨ Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (user) {
      fetchTasks();
    }
  }, [user, loading]);

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
    if (!title) return;

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

  // ✨ Update Title
  const updateTaskTitle = async (id: string) => {
    try {
      const res = await API.put(`/tasks/task/${id}`, {
        title: editTitle,
      });

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
    <div className="space-y-8">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-600 dark:text-white hover:text-black dark:hover:text-gray-300 transition"
      >
        ← Back
      </button>

      {/* Create Task */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border dark:border-gray-800">
        <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
          Add New Task
        </h2>

        <form onSubmit={createTask} className="flex gap-4">
          <input
            type="text"
            placeholder="Task title..."
            className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-black dark:bg-gray-800 dark:border-gray-700 outline-none transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition">
            Add
          </button>
        </form>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((status) => (
          <div
            key={status}
            className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border dark:border-gray-800 transition"
          >
            <h3 className="font-semibold mb-4 capitalize text-gray-700 dark:text-gray-200">
              {status.replace("-", " ")}
            </h3>

            <div className="space-y-4">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div
                    key={task._id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {editingId === task._id ? (
                      <>
                        <input
                          className="w-full mb-3 p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                          value={editTitle}
                          onChange={(e) =>
                            setEditTitle(e.target.value)
                          }
                        />

                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={() => updateTaskTitle(task._id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-400 text-white rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold mb-3 text-gray-800 dark:text-white">
                          {task.title}
                        </p>

                        <button
                          onClick={() => {
                            setEditingId(task._id);
                            setEditTitle(task.title);
                          }}
                          className="text-blue-500 text-xs mb-3"
                        >
                          Edit
                        </button>
                      </>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs">
                      {columns.map((col) => (
                        <button
                          key={col}
                          onClick={() =>
                            updateTaskStatus(task._id, col)
                          }
                          className={`px-2 py-1 rounded-md transition ${
                            task.status === col
                              ? "bg-black text-white"
                              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          {col}
                        </button>
                      ))}

                      <button
                        onClick={() => deleteTask(task._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

              {tasks.filter((task) => task.status === status).length === 0 && (
                <p className="text-sm text-gray-400">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}