function ProgressOverview({
  completedDays,
  currentDayProgress,
  currentDay,
  tasks = [],
  totalDays = 100,
  darkMode = false,
}) {
  const totalProgress = (completedDays / totalDays) * 100;
  const currentDayComplete =
    currentDayProgress.completed === currentDayProgress.total &&
    currentDayProgress.total > 0;

  const containerClass = darkMode
    ? "bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700 text-gray-100"
    : "bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-gray-900";

  const sectionBg = darkMode
    ? "bg-gray-700 border border-gray-700"
    : "bg-white rounded-lg border border-gray-100";

  return (
    <div className={containerClass}>
      <h2
        className={`text-xl font-semibold mb-6 ${
          darkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Progress Overview
      </h2>

      {/* Overall Progress */}
      <div className="mb-6">
        <div
          className={`flex justify-between text-sm mb-2 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <span>Overall Progress</span>
          <span>
            {completedDays}/{totalDays} days
          </span>
        </div>
        <div
          className={`${
            darkMode ? "bg-gray-700" : "bg-gray-200"
          } w-full rounded-full h-3`}
        >
          <div
            className={`${
              darkMode ? "bg-blue-400" : "bg-blue-600"
            } h-3 rounded-full transition-all duration-500`}
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
        <p
          className={`text-center text-2xl font-bold mt-2 ${
            darkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {totalProgress.toFixed(1)}%
        </p>
      </div>

      {/* Daily progress sparkline / bar chart */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Daily Progress
        </h3>
        <div
          className={`${
            darkMode
              ? "w-full h-20 bg-gray-800 rounded-md p-2 overflow-x-auto border border-gray-700"
              : "w-full h-20 bg-white rounded-md p-2 overflow-x-auto border border-gray-100"
          }`}
        >
          {/** make the svg wider on large totalDays so bars are readable on mobile; container scrolls horizontally */}
          <svg
            width={Math.max(300, totalDays * 6)}
            height={100}
            viewBox={`0 0 ${totalDays} 100`}
            preserveAspectRatio="none"
          >
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const completedCount = tasks.filter((t) =>
                t.completedDays.includes(day)
              ).length;
              const pct = tasks.length
                ? Math.round((completedCount / tasks.length) * 100)
                : 0;
              const x = i + 0.2;
              const barHeight = pct; // since viewBox height is 100
              return (
                <rect
                  key={i}
                  x={x}
                  y={100 - barHeight}
                  width={0.6}
                  height={barHeight}
                  fill={
                    darkMode
                      ? pct === 100
                        ? "#16a34a"
                        : pct > 0
                        ? "#60a5fa"
                        : "#374151"
                      : pct === 100
                      ? "#16a34a"
                      : pct > 0
                      ? "#0366d6"
                      : "#e5e7eb"
                  }
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Current Day Status */}
      <div className={`${sectionBg} mb-6 p-4 rounded-lg`}>
        <h3
          className={`font-medium mb-2 ${
            darkMode ? "text-gray-100" : "text-gray-700"
          }`}
        >
          Current Day Status
        </h3>
        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Day {currentDay}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentDayComplete
                ? darkMode
                  ? "bg-green-800 text-green-200"
                  : "bg-green-100 text-green-800"
                : currentDayProgress.completed > 0
                ? darkMode
                  ? "bg-yellow-800 text-yellow-200"
                  : "bg-yellow-100 text-yellow-800"
                : darkMode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {currentDayComplete
              ? "Complete"
              : currentDayProgress.completed > 0
              ? "In Progress"
              : "Not Started"}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div
          className={`${
            darkMode
              ? "p-3 bg-gray-700 rounded-lg border border-gray-700"
              : "p-3 bg-white rounded-lg border border-gray-100"
          }`}
        >
          <div
            className={`text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {completedDays}
          </div>
          <div
            className={`text-xs ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Days Complete
          </div>
        </div>
        <div
          className={`${
            darkMode
              ? "p-3 bg-gray-700 rounded-lg border border-gray-700"
              : "p-3 bg-white rounded-lg border border-gray-100"
          }`}
        >
          <div
            className={`text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {totalDays - completedDays}
          </div>
          <div
            className={`text-xs ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Days Remaining
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div
        className={`${
          darkMode
            ? "mt-6 p-3 bg-gray-700 rounded-lg"
            : "mt-6 p-3 bg-gray-50 rounded-lg"
        }`}
      >
        <p
          className={`text-sm text-center ${
            darkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {(() => {
            const pct = totalDays ? (completedDays / totalDays) * 100 : 0;
            if (pct === 0)
              return "Start your journey! Every great achievement begins with a single step.";
            if (pct > 0 && pct < 25)
              return "Great start! Building habits takes time, keep going!";
            if (pct >= 25 && pct < 50)
              return "You're building momentum! A quarter of the way there.";
            if (pct >= 50 && pct < 75)
              return "Halfway there! Your consistency is paying off.";
            if (pct >= 75 && pct < 100)
              return "Almost there! The finish line is in sight.";
            return "🎉 Congratulations! You've completed your challenge!";
          })()}
        </p>
      </div>
    </div>
  );
}

export default ProgressOverview;
