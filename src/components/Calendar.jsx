import { motion } from "framer-motion";

const Calendar = ({
  currentDay,
  onDayClick,
  completedDays,
  tasks,
  totalDays = 100,
  startDate,
  showCheck = false,
  dateLabelSetting = "short",
  darkMode = false,
}) => {
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

  const getDateObjForDay = (d) => {
    if (!startDate) return null;
    try {
      const base = new Date(startDate + "T00:00:00");
      const ms = base.getTime() + (d - 1) * 24 * 60 * 60 * 1000;
      return new Date(ms);
    } catch {
      return null;
    }
  };

  const percentComplete = (day) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter((t) =>
      (t.completedDays || []).includes(day)
    ).length;
    return Math.round((completed / tasks.length) * 100);
  };

  // compute which challenge day corresponds to today's date (if within range)
  const msPerDay = 24 * 60 * 60 * 1000;
  let todayIndex = null;
  try {
    if (startDate) {
      const today = new Date();
      const base = new Date(startDate + "T00:00:00");
      const diff = Math.floor((today - base) / msPerDay) + 1;
      if (diff >= 1 && diff <= totalDays) todayIndex = diff;
    }
  } catch {}

  // Generate calendar grid for totalDays (grid auto-wraps)
  const renderCalendar = () => {
    const days = [];
    for (let i = 1; i <= totalDays; i++) {
      const isCompleted = isDayCompleted(i);
      const isCurrent = i === currentDay;
      const isToday = todayIndex === i;
      const pct = percentComplete(i);
      const dateObj = getDateObjForDay(i);
      const labelText = dateObj
        ? dateLabelSetting === "long"
          ? dateObj.toLocaleDateString(undefined, {
              weekday: "short",
              month: "long",
              day: "numeric",
            })
          : dateObj.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })
        : "";

      const bgClass = (() => {
        if (darkMode) {
          if (isCurrent)
            return "bg-blue-600 text-white border-2 border-blue-500 shadow-sm";
          if (isCompleted)
            return "bg-gray-700 border-l-4 border-green-500 text-white shadow-sm";
          if (pct > 0)
            return "bg-gray-700 border-l-4 border-blue-400 text-white shadow-sm";
          if (isToday)
            return "bg-gray-700 border border-yellow-500 ring-1 ring-yellow-500/40 text-white";
          return "bg-gray-800 border border-gray-700 text-gray-100";
        }
        // light
        if (isCurrent)
          return "bg-white text-gray-900 border-2 border-blue-600 shadow-sm";
        if (isCompleted)
          return "bg-white border-l-4 border-green-500 text-gray-900 shadow-sm";
        if (pct > 0)
          return "bg-white border-l-4 border-blue-400 text-gray-900 shadow-sm";
        if (isToday)
          return "bg-white border border-yellow-300 ring-1 ring-yellow-300/40 text-gray-900";
        return "bg-white border border-gray-200 text-gray-900";
      })();

      days.push(
        <motion.button
          key={i}
          onClick={() => onDayClick(i)}
          title={`${getDateForDay(i)} — ${pct}% completed`}
          className={`
            w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-sm md:text-base lg:text-lg font-medium rounded-xl border transition-all duration-200 flex items-center justify-center relative overflow-hidden
            ${bgClass}
          `}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.005, duration: 0.25 }}
        >
          <div className="z-10 flex flex-col items-center">
            <span className="leading-none">{i}</span>
            {dateObj && (
              <span
                className={`mt-0.5 text-[10px] ${
                  dateLabelSetting === "always-mobile"
                    ? "block"
                    : "hidden md:block"
                } opacity-90 ${darkMode ? "text-gray-200" : "text-gray-600"}`}
              >
                {labelText}
              </span>
            )}
          </div>
          {/* small today marker when it's not the selected day */}
          {isToday && !isCurrent && (
            <span className="absolute top-1 left-1 w-2 h-2 bg-yellow-300 rounded-full z-20" />
          )}
          <div className="absolute left-0 right-0 bottom-0 h-1">
            <div
              style={{ width: `${pct}%` }}
              className={`h-1 ${
                pct === 100
                  ? "bg-green-500"
                  : pct > 0
                  ? "bg-blue-300"
                  : "bg-gray-200"
              }`}
            />
          </div>
          {showCheck && pct === 100 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/20 rounded-full p-1">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 10l3 3 7-7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          )}
        </motion.button>
      );
    }
    return days;
  };

  return (
    <motion.div
      className={`${
        darkMode
          ? "bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700 text-gray-100"
          : "bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-gray-900"
      }`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {totalDays}-Day Calendar
          </h3>
          <div className="text-xs text-gray-600 hidden sm:flex items-center gap-3">
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

        <div
          className={`text-xs ${
            darkMode ? "text-gray-300" : "text-gray-600"
          } mb-2`}
        >
          <div>
            Month:{" "}
            {(() => {
              try {
                if (!startDate) return "";
                const base = new Date(startDate + "T00:00:00");
                const ms =
                  base.getTime() + (currentDay - 1) * 24 * 60 * 60 * 1000;
                return new Date(ms).toLocaleString(undefined, {
                  month: "long",
                  year: "numeric",
                });
              } catch {
                return "";
              }
            })()}
          </div>
          <div>
            Today:{" "}
            {(() => {
              try {
                if (!startDate) return "";
                const today = new Date();
                const base = new Date(startDate + "T00:00:00");
                const diff =
                  Math.floor((today - base) / (24 * 60 * 60 * 1000)) + 1;
                if (diff >= 1 && diff <= totalDays) return `Day ${diff}`;
                return "Outside challenge range";
              } catch {
                return "";
              }
            })()}
          </div>
        </div>

        <div className="mb-4 overflow-x-auto">
          <div
            className={`grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 p-1`}
          >
            {renderCalendar()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar;
