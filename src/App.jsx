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
  const [activeTab, setActiveTab] = useState("tasks");

  // Load from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const savedDay = JSON.parse(localStorage.getItem("day")) || 1;
    const savedTotal = JSON.parse(localStorage.getItem("totalDays")) || 100;
    const savedStart = JSON.parse(localStorage.getItem("startDate")) || null;
    setTasks(savedTasks);
    setDay(savedDay);
    setTotalDays(savedTotal);
    if (savedStart) setStartDate(savedStart);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("day", JSON.stringify(day));
    localStorage.setItem("totalDays", JSON.stringify(totalDays));
    localStorage.setItem("startDate", JSON.stringify(startDate));
  }, [tasks, day, totalDays, startDate]);

  // Add new task
  const addTask = () => {
    setShowAddTask(true);
  };

  // Handle task form submission
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          name: newTaskName.trim(),
          completedDays: [],
          priority: newTaskPriority,
          reminderTime: newTaskReminder || null,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewTaskName("");
      setNewTaskPriority("Daily Routine");
      setNewTaskReminder("");
      setShowAddTask(false);
    }
  };

  // Cancel adding task
  const cancelAddTask = () => {
    setNewTaskName("");
    setShowAddTask(false);
  };

  // Toggle task completion for current day
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

  // Delete task
  const deleteTask = (id, e) => {
    e.stopPropagation(); // Prevent triggering toggleTask
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Calculate progress
  useEffect(() => {
    const completedCount = tasks.filter((t) =>
      t.completedDays.includes(day)
    ).length;
    setProgress(tasks.length ? (completedCount / tasks.length) * 100 : 0);
  }, [tasks, day]);

  // Ensure current day stays within bounds when totalDays changes
  useEffect(() => {
    setDay((d) => Math.min(Math.max(1, d), totalDays));
  }, [totalDays]);

  // compute the date for a given challenge day based on startDate
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
        return "bg-white/20 text-white/90";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col lg:grid lg:grid-cols-4 gap-6 p-4 lg:p-6">
        {/* Left Side - Main Content */}
        <div className="lg:col-span-3 flex flex-col items-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-4 lg:mb-6 w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-0 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  changeMe
                </h1>
                <p className="text-sm text-white/80">🗓️ 100-Day Task Tracker</p>
              </div>

              {/* simple tab navbar */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("tasks")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeTab === "tasks"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab("progress")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeTab === "progress"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  Progress
                </button>
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    activeTab === "calendar"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  Calendar
                </button>
              </div>
            </div>
          </motion.div>

          {/* Page content */}
          {activeTab === "tasks" ? (
            <>
              {/* Day Selector */}
              <motion.div
                className="flex flex-col sm:flex-row items-center gap-2 lg:gap-4 mb-4 lg:mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  disabled={day === 1}
                  onClick={() => setDay((d) => Math.max(1, d - 1))}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-sm lg:text-base"
                  variant="outline"
                >
                  Previous
                </Button>
                <motion.span
                  className="text-lg lg:text-xl font-semibold bg-white/10 px-3 lg:px-4 py-2 rounded-full backdrop-blur-sm"
                  key={day}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Day {day} / {totalDays}
                </motion.span>
                <Button
                  disabled={day === totalDays}
                  onClick={() => setDay((d) => Math.min(totalDays, d + 1))}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-sm lg:text-base"
                  variant="outline"
                >
                  Next
                </Button>

                <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 flex items-center gap-2 text-sm">
                  <label className="flex items-center gap-2 text-white/80">
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
                  <label className="flex items-center gap-2 text-white/80">
                    <span className="text-xs">Start</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-2 py-1 rounded-md text-black"
                      title="Start date of the challenge"
                    />
                  </label>
                </div>
              </motion.div>

              <div className="text-sm text-white/80 mb-4">
                <p>📅 {getDateForDay(day)}</p>
              </div>

              {/* Circular Progress */}
              <motion.div
                className="mb-6 lg:mb-8 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="bg-white/10 p-4 lg:p-6 rounded-2xl backdrop-blur-sm shadow-xl">
                  <CircularProgress
                    value={progress}
                    size={120}
                    strokeWidth={8}
                  />
                  <motion.p
                    className="mt-3 lg:mt-4 text-center text-base lg:text-lg font-semibold text-white/90"
                    key={progress}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Today's Progress
                  </motion.p>
                </div>
              </motion.div>

              {/* Task List & groups */}
              <div className="w-full max-w-xl mb-6">
                <div className="grid gap-3 lg:gap-4 w-full">
                  {tasks.length === 0 && (
                    <motion.p
                      className="text-center italic text-white/70 text-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      No tasks yet. Add one below! ✨
                    </motion.p>
                  )}

                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(() => {
                      const groups = [
                        { key: "Most Important", label: "Most Important" },
                        { key: "Daily Routine", label: "Daily Routine" },
                        { key: "For Later", label: "For Later" },
                      ];
                      return groups.map((g) => {
                        const items = tasks.filter(
                          (t) => (t.priority || "Daily Routine") === g.key
                        );
                        return (
                          <div
                            key={g.key}
                            className="bg-white/5 rounded-lg p-3"
                          >
                            <h4 className="text-sm font-semibold mb-2">
                              {g.label}
                            </h4>
                            <div className="space-y-3">
                              {items.length === 0 ? (
                                <p className="text-xs text-white/60 italic">
                                  No tasks
                                </p>
                              ) : (
                                items.map((task) => (
                                  <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.18 }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                  >
                                    <Card
                                      className={`cursor-pointer shadow-xl transition-all duration-300 ${
                                        task.completedDays.includes(day)
                                          ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-green-500/25"
                                          : "bg-white/95 text-gray-800 hover:bg-white shadow-xl backdrop-blur-sm"
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
                                              {task.priority || "Daily Routine"}
                                            </span>
                                            {task.reminderTime && (
                                              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                                                ⏰ {task.reminderTime} •{" "}
                                                {getDateForDay(day)}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {task.completedDays.includes(day) && (
                                            <motion.div
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 20,
                                              }}
                                            >
                                              <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6" />
                                            </motion.div>
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
                                  </motion.div>
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

              {/* Calendar on the right side remains visible in the layout — it's in the right column */}
            </>
          ) : activeTab === "progress" ? (
            <div className="w-full max-w-3xl">
              <ProgressOverview
                completedDays={
                  tasks.filter((t) => t.completedDays.length > 0).length
                }
                currentDayProgress={{
                  completed: tasks.filter((t) => t.completedDays.includes(day))
                    .length,
                  total: tasks.length,
                }}
                currentDay={day}
                tasks={tasks}
                totalDays={totalDays}
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
              />
            </div>
          )}

          {/* Developer Credit */}
          <motion.footer
            className="mt-8 lg:mt-12 mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              <p className="text-white/70 text-sm">
                Developed with ❤️ by{" "}
                <span className="font-semibold text-white">Atul Mittal</span>
              </p>
            </div>
          </motion.footer>
        </div>

        {/* Right Side - Calendar (only show when on Tasks tab) */}
        {activeTab === "tasks" && (
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <div className="w-full max-w-sm">
              <Calendar
                currentDay={day}
                onDayClick={setDay}
                completedDays={[]}
                tasks={tasks}
                totalDays={totalDays}
                startDate={startDate}
              />
            </div>
          </div>
        )}
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
            className="rounded-full p-4 lg:p-6 shadow-2xl bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-300 hover:to-orange-300 transition-all duration-300"
          >
            <Plus className="w-5 h-5 lg:w-6 lg:h-6" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
