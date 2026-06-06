export const WORKOUT_STORAGE_KEY = "liftlog-lite.workout-state.v1";

export function readWorkoutStorage() {
  try {
    const raw = window.localStorage.getItem(WORKOUT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error(error);
    return {};
  }
}

export function saveWorkoutStorage(state) {
  window.localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(state));
}
