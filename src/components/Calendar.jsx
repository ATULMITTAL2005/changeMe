import { motion } from "framer-motion";

const Calendar = ({ currentDay, onDayClick, completedDays, tasks, totalDays = 100, startDate }) => {
  // Helper function to check if a day is completed (all tasks done that day)
  const isDayCompleted = (day) => {
    if (!tasks || tasks.length === 0) return false;
    return tasks.every((task) => (task.completedDays || []).includes(day));
  };

  const getDateForDay = (d) => {
    if (!startDate) return "";
    try {
      const base = new Date(startDate + "T00:00:00");
      const ms = base.getTime() + (d - 1) * 24 * 60 * 60 * 1000;
      return new Date(ms).toLocaleDateString();
    } catch {
      return "";
    }
  };

  const percentComplete = (day) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter((t) => (t.completedDays || []).includes(day)).length;
    return Math.round((completed / tasks.length) * 100);
  };

  // Generate calendar grid for totalDays (grid auto-wraps)
  const renderCalendar = () => {
    const days = [];
    for (let i = 1; i <= totalDays; i++) {
      const isCompleted = isDayCompleted(i);
      const isCurrent = i === currentDay;
      const pct = percentComplete(i);

      const bgClass = isCurrent
        ? "bg-yellow-400 text-black border-yellow-500 shadow-lg"
        : isCompleted
        ? "bg-gradient-to-br from-green-400 to-green-600 text-white border-green-600 shadow-md"
        : pct > 0
        ? "bg-blue-500 text-white border-blue-600 shadow-sm"
        : "bg-white/5 text-white border-white/20";

      days.push(
        <motion.button
          key={i}
          onClick={() => onDayClick(i)}
          title={`${getDateForDay(i)} — ${pct}% completed`}
          className={`
            w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-sm font-medium rounded-xl border transition-all duration-200 flex items-center justify-center relative overflow-hidden
            ${bgClass}
          `}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.005, duration: 0.25 }}
        >
          <span className="z-10">{i}</span>
          <div className="absolute left-0 right-0 bottom-0 h-1">
            <div
              style={{ width: `${pct}%` }}
              className={`h-1 ${pct === 100 ? 'bg-green-600' : pct > 0 ? 'bg-blue-400' : 'bg-white/10'}`}
            />
          </div>
        </motion.button>
      );
    }
    return days;
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white text-center">{totalDays}-Day Calendar</h3>
        <div className="text-xs text-white/80 hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <span>Current</span>
          </div>
        </div>
      </div>
      <div className="mb-4 overflow-x-auto">
        <div className={`grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 p-1`}>{renderCalendar()}</div>
      </div>
    </motion.div>
  );
};

export default Calendar;
