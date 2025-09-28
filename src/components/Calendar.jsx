import { motion } from "framer-motion";

const Calendar = ({ currentDay, onDayClick, completedDays, tasks }) => {
  // Helper function to check if a day is completed
  const isDayCompleted = (day) => {
    if (tasks.length === 0) return false;
    return tasks.every((task) => task.completedDays.includes(day));
  };

  // Generate calendar grid for 100 days (10x10)
  const renderCalendar = () => {
    const days = [];
    for (let i = 1; i <= 100; i++) {
      const isCompleted = isDayCompleted(i);
      const isCurrent = i === currentDay;

      days.push(
        <motion.button
          key={i}
          onClick={() => onDayClick(i)}
          className={`
            w-8 h-8 text-xs font-medium rounded-full border transition-all duration-200
            ${
              isCurrent
                ? "bg-yellow-400 text-black border-yellow-500 shadow-lg ring-2 ring-white/50"
                : isCompleted
                ? "bg-green-500 text-white border-green-600 shadow-md hover:bg-green-600"
                : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40"
            }
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.01, duration: 0.3 }}
        >
          {i}
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
      <h3 className="text-lg font-semibold text-white mb-4 text-center">
        100-Day Calendar
      </h3>
      <div className="grid grid-cols-10 gap-1 mb-4">{renderCalendar()}</div>
      <div className="text-xs text-white/70 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span>Current Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white/20 rounded-full border border-white/40"></div>
          <span>Remaining</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar;
