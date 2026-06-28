# LiftLog Lite

LiftLog Lite is a small frontend-only workout tracker built as a fun mini project. It helps track active workout sessions, rest timers, set logs, workout history, and home-friendly exercises.

The app runs fully in the browser and stores data locally.

## Features

- Workout session timer
- Rest timer with rest-ended popup
- Set logging during a workout
- Saved workout history
- Session notes and ratings
- JSON backup and import
- Markdown export for workout reports
- Home-friendly exercise library
- Exercise search and filters by category, equipment, difficulty, and demo availability

## Tech Stack

- React
- Vite
- Tailwind CSS
- LocalStorage

## Running Locally

```bash
npm install
npm run dev
```

## Commands

```bash
npm run build
npm run lint
npm run test:run
```

## Project Structure

```text
src/
  app/       Routing, providers, and application layout
  pages/     Thin route composition
  features/  Timer, history, exercises, and settings
  domain/    Shared workout model, persistence, and serialization
  shared/    Reusable UI, hooks, utilities, and style primitives
  data/      Static exercise data
```

## Module Rules

- Pages compose feature public APIs and do not own business logic.
- Features import other features through their `index.js` entry points.
- Workout behavior shared by multiple features belongs in `domain/workout`.
- Generic UI, hooks, utilities, and style primitives belong in `shared`.
- Feature components, hooks, models, tests, and styles stay colocated.
- Storage keys and serialized workout formats must remain backward compatible.

ESLint enforces public alias imports for `features`, `domain`, and `shared`.
