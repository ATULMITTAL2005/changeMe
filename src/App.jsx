import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import CircularProgress from "./components/CircularProgress";
import Calendar from "./components/Calendar";

export default function DailyTaskApp() {
  const TOTAL_DAYS = 100;
  const [tasks, setTasks] = useState([]);
  const [day, setDay] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  // Load from localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const savedDay = JSON.parse(localStorage.getItem("day")) || 1;
    setTasks(savedTasks);
    setDay(savedDay);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("day", JSON.stringify(day));
  }, [tasks, day]);

  // Add new task
  const addTask = () => {
    setShowAddTask(true);
  };

  // Handle task form submission
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      setTasks([...tasks, { name: newTaskName.trim(), completedDays: [] }]);
      setNewTaskName("");
      setShowAddTask(false);
    }
  };

  // Cancel adding task
  const cancelAddTask = () => {
    setNewTaskName("");
    setShowAddTask(false);
  };

  // Toggle task completion for current day
  const toggleTask = (index) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index
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
  const deleteTask = (index, e) => {
    e.stopPropagation(); // Prevent triggering toggleTask
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Calculate progress
  useEffect(() => {
    const completedCount = tasks.filter((t) =>
      t.completedDays.includes(day)
    ).length;
    setProgress(tasks.length ? (completedCount / tasks.length) * 100 : 0);
  }, [tasks, day]);

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
            className="text-center mb-6 lg:mb-8"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              changeMe
            </h1>
            <p className="text-lg lg:text-xl text-white/80">
              🗓️ 100-Day Task Tracker
            </p>
          </motion.div>

          {/* Day Selector */}
          <motion.div
            className="flex items-center gap-2 lg:gap-4 mb-4 lg:mb-6"
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
              Day {day} / {TOTAL_DAYS}
            </motion.span>
            <Button
              disabled={day === TOTAL_DAYS}
              onClick={() => setDay((d) => Math.min(TOTAL_DAYS, d + 1))}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-sm lg:text-base"
              variant="outline"
            >
              Next
            </Button>
          </motion.div>

          {/* Circular Progress */}
          <motion.div
            className="mb-6 lg:mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <div className="bg-white/10 p-4 lg:p-6 rounded-2xl backdrop-blur-sm shadow-xl">
              <CircularProgress value={progress} size={120} strokeWidth={8} />
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

          {/* Task List */}
          <div className="grid gap-3 lg:gap-4 w-full max-w-xl">
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

            {tasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer shadow-xl transition-all duration-300 ${
                    task.completedDays.includes(day)
                      ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-green-500/25"
                      : "bg-white/95 text-gray-800 hover:bg-white shadow-xl backdrop-blur-sm"
                  }`}
                  onClick={() => toggleTask(index)}
                >
                  <CardContent className="flex items-center justify-between p-4 lg:p-6">
                    <span className="font-medium text-base lg:text-lg">
                      {task.name}
                    </span>
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
                        onClick={(e) => deleteTask(index, e)}
                      >
                        <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

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

        {/* Right Side - Calendar */}
        <div className="lg:col-span-1 flex justify-center lg:justify-start">
          <div className="w-full max-w-sm">
            <Calendar
              currentDay={day}
              onDayClick={setDay}
              completedDays={[]}
              tasks={tasks}
            />
          </div>
        </div>
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

      {/* Add Task Button */}
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
    </div>
  );
}
