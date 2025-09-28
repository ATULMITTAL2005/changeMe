function DayTracker({
  currentDay,
  tasks,
  dailyProgress,
  onToggleTask,
  onDayChange,
}) {
  const dayProgress = dailyProgress[currentDay] || {};

  const handleDayChange = (direction) => {
    const newDay = direction === "next" ? currentDay + 1 : currentDay - 1;
    if (newDay >= 1 && newDay <= 100) {
      onDayChange(newDay);
    }
  };

  const completedTasks = Object.values(dayProgress).filter(Boolean).length;
  const progressPercentage =
    tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Day {currentDay}/100
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleDayChange("prev")}
            disabled={currentDay <= 1}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => handleDayChange("next")}
            disabled={currentDay >= 100}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Progress bar for current day */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Today's Progress</span>
          <span>
            {completedTasks}/{tasks.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            Add some tasks to get started!
          </p>
        ) : (
          tasks.map((task) => (
            <label
              key={task.id}
              className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={dayProgress[task.id] || false}
                onChange={() => onToggleTask(currentDay, task.id)}
                className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <span
                className={`ml-3 text-gray-700 ${
                  dayProgress[task.id] ? "line-through text-gray-500" : ""
                }`}
              >
                {task.text}
              </span>
            </label>
          ))
        )}
      </div>

      {completedTasks === tasks.length && tasks.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
          <p className="text-green-700 font-medium text-center">
            🎉 Day {currentDay} Complete!
          </p>
        </div>
      )}
    </div>
  );
}

export default DayTracker;
