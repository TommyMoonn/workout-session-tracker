import { clampSeconds, createEmptyReview } from "@domain/workout";
import { defaultRestSeconds } from "../constants";

export function createInitialTimerState(data = {}) {
  const fallback = createFallbackTimerState();
  const savedSessions = Array.isArray(data?.sessionLogs) ? data.sessionLogs : [];
  const activeSession = data?.activeSession;

  if (!activeSession || typeof activeSession !== "object") {
    return {
      ...fallback,
      selectedSessionId: data?.selectedSessionId ?? savedSessions[0]?.id ?? null,
      sessionLogs: savedSessions,
    };
  }

  const savedRestDuration = clampSeconds(Number(activeSession.restDuration || defaultRestSeconds));
  const savedWorkoutStatus = activeSession.workoutStatus === "running" ? "paused" : activeSession.workoutStatus;
  const savedRestStatus = activeSession.restStatus === "running" ? "paused" : activeSession.restStatus;
  const savedWorkoutElapsed = Math.max(0, Math.floor(activeSession.workoutElapsed || 0));
  const savedRestRemaining = Math.max(0, Math.floor(activeSession.restRemaining ?? savedRestDuration));

  return {
    ...fallback,
    activeSetId: activeSession.activeSetId ?? null,
    restDuration: savedRestDuration,
    restDurationInput: String(activeSession.restDurationInput || savedRestDuration),
    restElapsedBeforeStart: Math.max(0, savedRestDuration - savedRestRemaining),
    restRemaining: savedRestRemaining,
    restRemainingAtStart: savedRestRemaining,
    restStatus: ["idle", "paused", "done"].includes(savedRestStatus) ? savedRestStatus : "idle",
    selectedSessionId: data?.selectedSessionId ?? savedSessions[0]?.id ?? null,
    sessionLogs: savedSessions,
    setLogs: Array.isArray(activeSession.setLogs) ? activeSession.setLogs : [],
    workoutElapsed: savedWorkoutElapsed,
    workoutElapsedBeforeStart: savedWorkoutElapsed,
    workoutStatus: ["idle", "paused", "finished"].includes(savedWorkoutStatus)
      ? savedWorkoutStatus
      : "idle",
  };
}

export function buildActiveSessionSnapshot(state, workoutElapsed, restRemaining) {
  return {
    workoutElapsed,
    workoutStatus: state.workoutStatus,
    restDuration: state.restDuration,
    restDurationInput: state.restDurationInput,
    restRemaining,
    restStatus: state.restStatus,
    activeSetId: state.activeSetId,
    setLogs: state.setLogs,
  };
}

export function buildResetActiveSessionSnapshot(seconds) {
  return {
    workoutElapsed: 0,
    workoutStatus: "idle",
    restDuration: seconds,
    restDurationInput: String(seconds),
    restRemaining: seconds,
    restStatus: "idle",
    activeSetId: null,
    setLogs: [],
  };
}

function createFallbackTimerState() {
  return {
    activeSetId: null,
    finishDraft: null,
    isSetPanelOpen: false,
    loggedSessionNotice: null,
    restDuration: defaultRestSeconds,
    restDurationInput: String(defaultRestSeconds),
    restElapsedBeforeStart: 0,
    restRemaining: defaultRestSeconds,
    restRemainingAtStart: defaultRestSeconds,
    restStartedAt: null,
    restStatus: "idle",
    selectedSessionId: null,
    sessionLogs: [],
    sessionReview: createEmptyReview(),
    setLogs: [],
    workoutElapsed: 0,
    workoutElapsedBeforeStart: 0,
    workoutStartedAt: null,
    workoutStatus: "idle",
  };
}
