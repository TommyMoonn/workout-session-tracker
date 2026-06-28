export function selectIsWorkoutRunning(state) {
  return state.workoutStatus === "running";
}

export function selectIsRestRunning(state) {
  return state.restStatus === "running";
}

export function selectHasActiveSession(state) {
  return state.workoutElapsed > 0
    || state.workoutStatus === "running"
    || state.workoutStatus === "paused"
    || state.setLogs.length > 0;
}

export function selectTotalRestSeconds(state) {
  return state.setLogs.reduce((sum, log) => sum + (log.restActualSeconds ?? 0), 0);
}

export function selectRestProgress(state) {
  if (!state.restDuration) return 0;
  return Math.min(
    100,
    Math.max(0, ((state.restDuration - state.restRemaining) / state.restDuration) * 100)
  );
}

export function selectWorkoutSummary(state) {
  const minutes = Math.floor(state.workoutElapsed / 60);
  if (minutes < 10) return "Warm-up window";
  if (minutes < 35) return "Main workout active";
  if (minutes < 60) return "Strong session";
  return "Long session";
}
