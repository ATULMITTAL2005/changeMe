# changeMe - 100-Day Task Tracker

A simple and clean To-Do List and Daily Task Tracker web app built with React and Tailwind CSS. Track your daily routine tasks for 100 consecutive days and build lasting habits.

## Features

- ✅ **Create Daily Routine Tasks** - Add tasks once and they automatically appear for all 100 days
- 📅 **100-Day Tracking** - Navigate through any day (1-100) to mark tasks as complete
- 💾 **Persistent Data** - All progress is saved locally using localStorage
- 📊 **Progress Overview** - Visual progress tracking showing completed days and overall progress
- 📱 **Mobile Responsive** - Clean, minimal UI that works on all devices
- 🎯 **Motivational Messages** - Encouraging messages based on your progress

## How to Use

1. **Add Your Daily Tasks**: Start by adding routine tasks like "Workout", "Read 20 pages", "Meditate" in the Task Manager
2. **Track Daily**: Use the Day Tracker to check off completed tasks for each day
3. **Monitor Progress**: View your overall progress and completion statistics
4. **Stay Motivated**: Get encouraging messages as you progress through your 100-day journey

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technical Details

- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS for responsive design
- **Build Tool**: Vite for fast development and building
- **Data Storage**: localStorage for persistent data (no backend required)
- **Mobile First**: Responsive design optimized for mobile devices

## Project Structure

```
src/
├── components/
│   ├── TaskManager.jsx      # Add and manage routine tasks
│   ├── DayTracker.jsx       # Daily task checklist with navigation
│   └── ProgressOverview.jsx # Progress statistics and motivation
├── App.jsx                  # Main application component
├── main.jsx                 # Application entry point
└── index.css               # Tailwind CSS imports
```

## Features in Detail

### Task Management

- Add daily routine tasks that will appear for all 100 days
- Remove tasks (also removes them from all days)
- Tasks are stored persistently

### Day Navigation

- Navigate between Day 1 and Day 100
- Visual progress bar for current day
- Mark individual tasks as complete
- Celebration message when day is complete

### Progress Tracking

- Overall progress percentage (completed days / 100)
- Current day completion status
- Quick stats showing completed and remaining days
- Motivational messages based on progress milestones

### Data Persistence

All data is stored in the browser's localStorage:

- Routine tasks
- Daily completion status for each task
- Current day selection
- Complete progress history

## Browser Support

Modern browsers that support:

- ES6+ JavaScript features
- localStorage API
- CSS Grid and Flexbox

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and submit pull requests for any improvements!
