function ProgressOverview({ completedDays, currentDayProgress, currentDay }) {
  const totalProgress = (completedDays / 100) * 100;
  const currentDayComplete =
    currentDayProgress.completed === currentDayProgress.total &&
    currentDayProgress.total > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Progress Overview
      </h2>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{completedDays}/100 days</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
        <p className="text-center text-2xl font-bold text-blue-600 mt-2">
          {totalProgress.toFixed(1)}%
        </p>
      </div>

      {/* Current Day Status */}
      <div className="mb-6 p-4 rounded-lg border-2 border-dashed border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2">Current Day Status</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Day {currentDay}</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentDayComplete
                ? "bg-green-100 text-green-800"
                : currentDayProgress.completed > 0
                ? "bg-yellow-100 text-yellow-800"
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
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {completedDays}
          </div>
          <div className="text-xs text-green-700">Days Complete</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {100 - completedDays}
          </div>
          <div className="text-xs text-blue-700">Days Remaining</div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <p className="text-sm text-gray-700 text-center">
          {completedDays === 0 &&
            "Start your journey! Every great achievement begins with a single step."}
          {completedDays > 0 &&
            completedDays < 25 &&
            "Great start! Building habits takes time, keep going!"}
          {completedDays >= 25 &&
            completedDays < 50 &&
            "You're building momentum! A quarter of the way there."}
          {completedDays >= 50 &&
            completedDays < 75 &&
            "Halfway there! Your consistency is paying off."}
          {completedDays >= 75 &&
            completedDays < 100 &&
            "Almost there! The finish line is in sight."}
          {completedDays === 100 &&
            "🎉 Congratulations! You've completed your 100-day challenge!"}
        </p>
      </div>
    </div>
  );
}

export default ProgressOverview;
