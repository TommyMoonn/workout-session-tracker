# LiftLog Lite

LiftLog Lite is a small frontend-only workout tracker I built for myself to make gym sessions easier to follow. It focuses on the core things I actually need during a workout: tracking how long the session has been running, managing rest timers, logging completed sets, and saving simple notes after finishing.

The app runs fully in the browser.

## What it does

- Tracks the total workout session time
- Starts a rest timer automatically when a set is completed
- Logs sets with session-based timestamps
- Tracks total rest time and sets completed
- Shows a rest-ended popup with an alarm
- Lets me delete individual sets if I make a mistake
- Saves session notes after finishing a workout
- Supports editing saved session notes
- Stores workout history locally in the browser
- Supports JSON backup/import
- Supports Markdown export for workout reports

## Session notes

When finishing a session, the app asks for a quick review:

- Workout type, such as push day, pull day, leg day, or chest day
- Thoughts and feelings about the session
- Energy rating from 0 to 5
- Difficulty rating from 0 to 5
- Mood rating from 0 to 5
- Overall experience rating from 0 to 5

## Local-first storage

For manual backup, the app can export and load JSON files. It can also export workout sessions as Markdown reports.

## Tech stack

- React
- Vite
- Tailwind CSS

## Running locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

## Notes

This is mainly a personal mini project for my own workouts. The focus is a simple, fast, local-first workout timer and session logger that feels good to use during actual workouts.
