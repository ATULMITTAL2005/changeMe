import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import CircularProgress from "./components/CircularProgress";
import ProgressOverview from "./components/ProgressOverview";
import Calendar from "./components/Calendar";

export default function DailyTaskApp() {
  const [tasks, setTasks] = useState([]);
  const [day, setDay] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Daily Routine");
  const [newTaskReminder, setNewTaskReminder] = useState("");
  const [totalDays, setTotalDays] = useState(100);
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [dateLabelSetting, setDateLabelSetting] = useState(
    () => JSON.parse(localStorage.getItem("dateLabelSetting")) || "short"
  );
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const raw = localStorage.getItem("darkMode");
      return raw !== null ? JSON.parse(raw) : true; // default to dark when no preference saved
    } catch (e) {
      return true;
    }
  });
  const [activeTab, setActiveTab] = useState("tasks");

  // Load from localStorage
  useEffect(() => {
    const savedTasksRaw = JSON.parse(localStorage.getItem("tasks")) || [];
    const savedDay = JSON.parse(localStorage.getItem("day")) || 1;
    const savedTotal = JSON.parse(localStorage.getItem("totalDays")) || 100;
    const savedStart = JSON.parse(localStorage.getItem("startDate")) || null;
    const savedDateLabel =
      JSON.parse(localStorage.getItem("dateLabelSetting")) || "short";
    const savedDark = JSON.parse(localStorage.getItem("darkMode")) || false;

    const savedTasks = savedTasksRaw.map((t) => {
      if (
        (t.priority || "") === "Most Important" &&
        (t.assignedDay === undefined || t.assignedDay === null)
      ) {
        return { ...t, assignedDay: savedDay };
      }
      return t;
    });
    setTasks(savedTasks);
    setDay(savedDay);
    setTotalDays(savedTotal);
    if (savedStart) setStartDate(savedStart);
    setDateLabelSetting(savedDateLabel);
    setDarkMode(savedDark);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("day", JSON.stringify(day));
    localStorage.setItem("totalDays", JSON.stringify(totalDays));
    localStorage.setItem("startDate", JSON.stringify(startDate));
    localStorage.setItem("dateLabelSetting", JSON.stringify(dateLabelSetting));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [tasks, day, totalDays, startDate, dateLabelSetting, darkMode]);

  const addTask = () => setShowAddTask(true);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        name: newTaskName.trim(),
        completedDays: [],
        priority: newTaskPriority,
        reminderTime: newTaskReminder || null,
        assignedDay: newTaskPriority === "Most Important" ? day : null,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewTaskName("");
    setNewTaskPriority("Daily Routine");
    setNewTaskReminder("");
    setShowAddTask(false);
  };

  const cancelAddTask = () => {
    setNewTaskName("");
    setShowAddTask(false);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completedDays: task.completedDays.includes(day)
                ? task.completedDays.filter((d) => d !== day)
                : [...task.completedDays, day],
            }
          : task
      )
    );
  };

  const deleteTask = (id, e) => {
    e?.stopPropagation?.();
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  useEffect(() => {
    const completedCount = tasks.filter((t) =>
      t.completedDays.includes(day)
    ).length;
    setProgress(tasks.length ? (completedCount / tasks.length) * 100 : 0);
  }, [tasks, day]);

  useEffect(() => {
    setDay((d) => Math.min(Math.max(1, d), totalDays));
  }, [totalDays]);

  const getDateForDay = (d) => {
    try {
      const base = new Date(startDate + "T00:00:00");
      const ms = base.getTime() + (d - 1) * 24 * 60 * 60 * 1000;
      return new Date(ms).toLocaleDateString();
    } catch (e) {
      return "";
    }
  };

  const priorityBadgeClass = (priority) => {
    switch ((priority || "").toLowerCase()) {
      case "most important":
        return "bg-red-500 text-white";
      case "daily routine":
        return "bg-blue-500 text-white";
      case "for later":
        return "bg-yellow-400 text-black";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } min-h-screen`}
    >
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-6 gap-6 p-4 lg:p-6">
        <aside
          className={`${
            darkMode
              ? "bg-gray-800 text-gray-100 border border-gray-700"
              : "bg-white text-gray-900 border border-gray-200"
          } hidden lg:flex lg:flex-col lg:col-span-1 gap-4 p-4 rounded-lg`}
        >
          <div>
            <h2 className="text-lg font-semibold">changeMe</h2>
          </div>

          <nav className="flex flex-col gap-2 mt-2">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`${
                activeTab === "tasks"
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "text-gray-200 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              } text-left px-3 py-2 rounded-md`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={`${
                activeTab === "progress"
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "text-gray-200 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              } text-left px-3 py-2 rounded-md`}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`${
                activeTab === "calendar"
                  ? "bg-blue-600 text-white"
                  : darkMode
                  ? "text-gray-200 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              } text-left px-3 py-2 rounded-md`}
            >
              Calendar
            </button>
          </nav>

          <div className="mt-auto">
            <div className="mb-2">
              <Button onClick={addTask} className="w-full">
                Add Task
              </Button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm">Dark</label>
              <button
                onClick={() => setDarkMode((m) => !m)}
                className={`${
                  darkMode
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                } px-2 py-1 rounded`}
              >
                {darkMode ? "On" : "Off"}
              </button>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-5">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-0">
                  changeMe
                </h1>
              </div>

              {/* simple tab navbar for smaller screens */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`${
                    activeTab === "tasks"
                      ? "border-b-2 border-blue-600 text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  } px-3 py-1 rounded-md text-sm`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab("progress")}
                  className={`${
                    activeTab === "progress"
                      ? "border-b-2 border-blue-600 text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  } px-3 py-1 rounded-md text-sm`}
                >
                  Progress
                </button>
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`${
                    activeTab === "calendar"
                      ? "border-b-2 border-blue-600 text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  } px-3 py-1 rounded-md text-sm`}
                >
                  Calendar
                </button>
              </div>
            </div>

            {/* Page content */}
            {activeTab === "tasks" ? (
              <>
                <div className="flex flex-col sm:flex-row items-center gap-2 lg:gap-4 mb-4 lg:mb-6">
                  <Button
                    disabled={day === 1}
                    onClick={() => setDay((d) => Math.max(1, d - 1))}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-sm lg:text-base"
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="text-lg lg:text-xl font-semibold bg-white/10 px-3 lg:px-4 py-2 rounded-full">
                    Day {day} / {totalDays}
                  </span>
                  <Button
                    disabled={day === totalDays}
                    onClick={() => setDay((d) => Math.min(totalDays, d + 1))}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-sm lg:text-base"
                    variant="outline"
                  >
                    Next
                  </Button>

                  <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 flex items-center gap-2 text-sm">
                    <label className="flex items-center gap-2">
                      <span className="text-xs">Length</span>
                      <input
                        type="number"
                        min={10}
                        max={365}
                        value={totalDays}
                        onChange={(e) =>
                          setTotalDays(Number(e.target.value) || 100)
                        }
                        className="w-16 px-2 py-1 rounded-md text-black"
                        title="Total days for the challenge"
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      <span className="text-xs">Start</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-2 py-1 rounded-md text-black"
                        title="Start date of the challenge"
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      <span className="text-xs">Date Label</span>
                      <select
                        value={dateLabelSetting}
                        onChange={(e) => setDateLabelSetting(e.target.value)}
                        className="px-2 py-1 rounded-md text-black"
                        title="How dates are shown on calendar cells"
                      >
                        <option value="short">Short</option>
                        <option value="long">Long</option>
                        <option value="always-mobile">Always (mobile)</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p>📅 {getDateForDay(day)}</p>
                </div>

                <div className="mb-6 lg:mb-8 flex justify-center">
                  <div
                    className={`${
                      darkMode
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-white border border-gray-200"
                    } p-4 lg:p-6 rounded-lg shadow-sm`}
                  >
                    <CircularProgress
                      value={progress}
                      size={120}
                      strokeWidth={8}
                    />
                    <p
                      className={`${
                        darkMode ? "text-gray-100" : "text-gray-900"
                      } mt-3 lg:mt-4 text-center text-base lg:text-lg font-semibold`}
                    >
                      Today's Progress
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-xl mb-6">
                  <div className="grid gap-3 lg:gap-4 w-full">
                    {tasks.length === 0 && (
                      <p className="text-center italic text-gray-500 text-lg">
                        No tasks yet. Add one below! ✨
                      </p>
                    )}

                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(() => {
                        const groups = [
                          { key: "Most Important", label: "Most Important" },
                          { key: "Daily Routine", label: "Daily Routine" },
                          { key: "For Later", label: "For Later" },
                        ];
                        return groups.map((g) => {
                          const items = tasks.filter((t) => {
                            const priority = t.priority || "Daily Routine";
                            if (g.key === "Most Important") {
                              return (
                                priority === "Most Important" &&
                                t.assignedDay === day
                              );
                            }
                            return priority === g.key;
                          });
                          return (
                            <div
                              key={g.key}
                              className={`${
                                darkMode
                                  ? "bg-gray-800 text-gray-100"
                                  : "bg-white/5 text-gray-900"
                              } rounded-lg p-3`}
                            >
                              <h4 className="text-sm font-semibold mb-2">
                                {g.label}
                              </h4>
                              <div className="space-y-3">
                                {items.length === 0 ? (
                                  <p className="text-xs text-gray-500 italic">
                                    No tasks
                                  </p>
                                ) : (
                                  items.map((task) => (
                                    <div key={task.id}>
                                      <Card
                                        className={`cursor-pointer transition-all duration-300 ${
                                          task.completedDays.includes(day)
                                            ? "bg-white border-l-4 border-green-500 text-gray-900 shadow-sm"
                                            : "bg-white border border-gray-200 text-gray-900 hover:shadow"
                                        }`}
                                        onClick={() => toggleTask(task.id)}
                                      >
                                        <CardContent className="flex items-center justify-between p-4 lg:p-6">
                                          <div>
                                            <div className="font-medium text-base lg:text-lg">
                                              {task.name}
                                            </div>
                                            <div className="mt-1 flex items-center gap-2 text-xs">
                                              <span
                                                className={`px-2 py-0.5 rounded-full ${priorityBadgeClass(
                                                  task.priority
                                                )}`}
                                              >
                                                {task.priority ||
                                                  "Daily Routine"}
                                              </span>
                                              {task.reminderTime && (
                                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                                  ⏰ {task.reminderTime} •{" "}
                                                  {getDateForDay(day)}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            {task.completedDays.includes(
                                              day
                                            ) && (
                                              <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6" />
                                            )}
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className={`p-2 hover:bg-red-500/20 ${
                                                task.completedDays.includes(day)
                                                  ? "text-white hover:bg-red-500/30"
                                                  : "text-red-500 hover:text-red-600"
                                              }`}
                                              onClick={(e) =>
                                                deleteTask(task.id, e)
                                              }
                                            >
                                              <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>

                {/* Right-side mini calendar for tasks view */}
                <div className="w-full flex justify-center lg:justify-start">
                  <div className="w-full max-w-sm">
                    <Calendar
                      currentDay={day}
                      onDayClick={setDay}
                      completedDays={[]}
                      tasks={tasks}
                      totalDays={totalDays}
                      startDate={startDate}
                      showCheck={false}
                      dateLabelSetting={dateLabelSetting}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
              </>
            ) : activeTab === "progress" ? (
              <div className="w-full max-w-3xl">
                <ProgressOverview
                  completedDays={
                    tasks.filter((t) => t.completedDays.length > 0).length
                  }
                  currentDayProgress={{
                    completed: tasks.filter((t) =>
                      t.completedDays.includes(day)
                    ).length,
                    total: tasks.length,
                  }}
                  currentDay={day}
                  tasks={tasks}
                  totalDays={totalDays}
                  darkMode={darkMode}
                />
              </div>
            ) : (
              <div className="w-full max-w-3xl">
                <Calendar
                  currentDay={day}
                  onDayClick={setDay}
                  completedDays={[]}
                  tasks={tasks}
                  totalDays={totalDays}
                  startDate={startDate}
                  showCheck={true}
                  dateLabelSetting={dateLabelSetting}
                  darkMode={darkMode}
                />
              </div>
            )}

            <motion.footer
              className="mt-8 lg:mt-12 mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div
                className={`${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white/10 backdrop-blur-sm"
                } rounded-full px-4 py-2 inline-block`}
              >
                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-white/70"
                  } text-sm`}
                >
                  Developed with ❤️ by{" "}
                  <span className="font-semibold">Atul Mittal</span>
                </p>
              </div>
            </motion.footer>
          </div>
        </main>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Add New Daily Task
            </h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Enter task name (e.g., 'Exercise', 'Read 20 pages')..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Priority</span>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-800"
                  >
                    <option value="Most Important">Most Important</option>
                    <option value="Daily Routine">Daily Routine</option>
                    <option value="For Later">For Later</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">
                    Reminder time
                  </span>
                  <input
                    type="time"
                    value={newTaskReminder}
                    onChange={(e) => setNewTaskReminder(e.target.value)}
                    className="px-3 py-2 rounded-md border border-gray-300 text-gray-800"
                  />
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={cancelAddTask}
                  variant="outline"
                  className="flex-1 py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  disabled={!newTaskName.trim()}
                >
                  Add Task
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Add Task Button (only show on Tasks tab) */}
      {activeTab === "tasks" && (
        <motion.div
          className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={addTask}
            className="rounded-full p-4 lg:p-6 shadow-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
          >
            <Plus className="w-5 h-5 lg:w-6 lg:h-6" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
