import { useCallback, useEffect, useReducer } from "react";
import {
  clampSeconds,
  normalizeSetLogs,
  readWorkoutStorage,
  updateWorkoutStorage,
} from "@domain/workout";
import { useTimerSettings } from "@features/settings/timer";
import { useToast } from "@shared/hooks/useToast";
import {
  createFinishDraft,
  createLoggedSession,
  createSetLog,
  updateSetRest,
} from "../model/sessionLifecycle";
import { readTimerTimestamp } from "../model/timerClock";
import { timerActionTypes, timerReducer } from "../model/timerReducer";
import {
  selectHasActiveSession,
  selectIsRestRunning,
  selectIsWorkoutRunning,
  selectRestProgress,
  selectTotalRestSeconds,
  selectWorkoutSummary,
} from "../model/timerSelectors";
import {
  buildActiveSessionSnapshot as createActiveSessionSnapshot,
  buildResetActiveSessionSnapshot,
  createInitialTimerState,
} from "../model/timerState";
import { useRestAlarm } from "./useRestAlarm";
import { useRestClock } from "./useRestClock";
import { useWorkoutClock } from "./useWorkoutClock";
import { useWorkoutPersistence } from "./useWorkoutPersistence";

export function useWorkoutTimer() {
  const [state, dispatch] = useReducer(
    timerReducer,
    undefined,
    () => createInitialTimerState(readWorkoutStorage())
  );
  const { toast, showToast } = useToast();
  const { settings: timerSettings } = useTimerSettings();
  const { restAlert, closeRestAlert, showRestEndedAlert } = useRestAlarm();

  const isWorkoutRunning = selectIsWorkoutRunning(state);
  const isRestRunning = selectIsRestRunning(state);
  const hasActiveSession = selectHasActiveSession(state);
  const totalRestSeconds = selectTotalRestSeconds(state);
  const restProgress = selectRestProgress(state);
  const workoutSummary = selectWorkoutSummary(state);

  const getCurrentWorkoutSeconds = useWorkoutClock({
    elapsedBeforeStart: state.workoutElapsedBeforeStart,
    isRunning: isWorkoutRunning,
    onTick: (elapsed) => dispatch({
      type: timerActionTypes.workoutTicked,
      elapsed,
    }),
    startedAt: state.workoutStartedAt,
  });

  const getCurrentRestSeconds = useRestClock({
    elapsedBeforeStart: state.restElapsedBeforeStart,
    isRunning: isRestRunning,
    onComplete: completeRestFromClock,
    onTick: (remaining) => dispatch({
      type: timerActionTypes.restTicked,
      remaining,
    }),
    remainingAtStart: state.restRemainingAtStart,
    startedAt: state.restStartedAt,
  });

  const buildActiveSessionSnapshot = useCallback(() => {
    const workoutElapsed = isWorkoutRunning
      ? getCurrentWorkoutSeconds()
      : state.workoutElapsed;
    const restRemaining = isRestRunning && state.restStartedAt
      ? Math.max(
        0,
        state.restRemainingAtStart
          - Math.floor((readTimerTimestamp() - state.restStartedAt) / 1000)
      )
      : state.restRemaining;

    return createActiveSessionSnapshot(state, workoutElapsed, restRemaining);
  }, [
    getCurrentWorkoutSeconds,
    isRestRunning,
    isWorkoutRunning,
    state,
  ]);

  useWorkoutPersistence({
    activeSetId: state.activeSetId,
    buildActiveSessionSnapshot,
    isRestRunning,
    isWorkoutRunning,
    restDuration: state.restDuration,
    restDurationInput: state.restDurationInput,
    restStatus: state.restStatus,
    selectedSessionId: state.selectedSessionId,
    sessionLogs: state.sessionLogs,
    setLogs: state.setLogs,
    workoutStatus: state.workoutStatus,
  });

  useEffect(() => {
    if (isRestRunning || state.activeSetId) return undefined;

    const defaultRestSyncTimer = window.setTimeout(() => {
      dispatch({
        type: timerActionTypes.defaultRestSynced,
        seconds: timerSettings.defaultRestSeconds,
      });
    }, 0);

    return () => window.clearTimeout(defaultRestSyncTimer);
  }, [isRestRunning, state.activeSetId, timerSettings.defaultRestSeconds]);

  function startWorkout() {
    dispatch({
      type: timerActionTypes.workoutStarted,
      startedAt: readTimerTimestamp(),
    });
  }

  function pauseWorkout() {
    dispatch({
      type: timerActionTypes.workoutPaused,
      elapsed: getCurrentWorkoutSeconds(),
    });
  }

  function resetWorkout() {
    closeRestAlert();
    dispatch({
      type: timerActionTypes.workoutReset,
      seconds: state.restDuration,
    });
    showToast("Workout session reset.");
  }

  function finishWorkout() {
    const endedAt = readTimerTimestamp();
    const workoutSeconds = getCurrentWorkoutSeconds();
    const finishDraft = createFinishDraft({
      activeSetId: state.activeSetId,
      endedAt,
      restActualSeconds: getCurrentRestSeconds(),
      setLogs: state.setLogs,
      workoutSeconds,
    });

    dispatch({
      type: timerActionTypes.finishDraftCreated,
      finishDraft,
      workoutElapsed: workoutSeconds,
    });
  }

  function submitFinishWorkout() {
    if (!state.finishDraft) return;

    const session = createLoggedSession(state.finishDraft, state.sessionReview);
    const nextSessionLogs = [
      session,
      ...state.sessionLogs.filter((savedSession) => savedSession.id !== session.id),
    ];

    updateWorkoutStorage({
      savedAt: readTimerTimestamp(),
      sessionLogs: nextSessionLogs,
      selectedSessionId: session.id,
      activeSession: buildResetActiveSessionSnapshot(state.restDuration),
    });
    dispatch({
      type: timerActionTypes.sessionLogged,
      sessionLogs: nextSessionLogs,
      selectedSessionId: session.id,
      restDuration: state.restDuration,
      notice: {
        id: session.id,
        workoutSeconds: session.workoutSeconds,
        totalRestSeconds: session.totalRestSeconds,
        setCount: session.setCount,
      },
    });
  }

  function cancelFinishWorkout() {
    dispatch({ type: timerActionTypes.finishCanceled });
    showToast("Session finish cancelled. Workout is paused.");
  }

  function completeSetAndStartRest() {
    const now = readTimerTimestamp();
    const shouldStartWorkout = state.workoutStatus === "idle"
      || state.workoutStatus === "finished";
    const sessionSeconds = shouldStartWorkout ? 0 : getCurrentWorkoutSeconds();
    const shouldAutoStartRest = timerSettings.autoStartRestAfterSet;
    const restSeconds = commitRestDurationInput();
    const replacedSetLogs = state.activeSetId
      ? updateSetRest(state.setLogs, state.activeSetId, {
        status: "Replaced by next set",
        endedAt: now,
        actualSeconds: getCurrentRestSeconds(),
        endedAtSessionSeconds: sessionSeconds,
      })
      : state.setLogs;
    const previousSet = replacedSetLogs[replacedSetLogs.length - 1];
    const previousRestEndSeconds = previousSet
      ? previousSet.restEndedAtSessionSeconds ?? sessionSeconds
      : 0;
    const setNumber = replacedSetLogs.length + 1;
    const setId = `${now}-${setNumber}`;
    const setLog = createSetLog({
      id: setId,
      setNumber,
      completedAt: now,
      completedAtSessionSeconds: sessionSeconds,
      previousRestEndSeconds,
      restTargetSeconds: restSeconds,
      shouldAutoStartRest,
    });

    dispatch({
      type: timerActionTypes.setCompleted,
      autoStartRest: shouldAutoStartRest,
      restSeconds,
      setId,
      setLogs: [...replacedSetLogs, setLog],
      startWorkout: shouldStartWorkout,
      timestamp: now,
    });
    showToast(
      shouldAutoStartRest
        ? `Set ${setNumber} logged. Rest started.`
        : `Set ${setNumber} logged.`
    );
  }

  function pauseRest() {
    if (!state.restStartedAt) return;

    const elapsedSegment = Math.floor(
      (readTimerTimestamp() - state.restStartedAt) / 1000
    );
    dispatch({
      type: timerActionTypes.restPaused,
      elapsed: state.restElapsedBeforeStart + elapsedSegment,
      remaining: Math.max(0, state.restRemainingAtStart - elapsedSegment),
    });
  }

  function resumeRest() {
    if (state.restRemaining <= 0 || !state.activeSetId) return;
    dispatch({
      type: timerActionTypes.restResumed,
      startedAt: readTimerTimestamp(),
    });
  }

  function resetRest() {
    if (!state.activeSetId) {
      dispatch({
        type: timerActionTypes.restReset,
        seconds: state.restDuration,
        status: "idle",
      });
      return;
    }

    const setLogs = updateSetRest(state.setLogs, state.activeSetId, {
      status: "Rest stopped",
      endedAt: readTimerTimestamp(),
      actualSeconds: getCurrentRestSeconds(),
      endedAtSessionSeconds: getCurrentWorkoutSeconds(),
    });
    dispatch({
      type: timerActionTypes.restReset,
      seconds: state.restDuration,
      setLogs,
      status: "idle",
    });
    showToast("Rest stopped and saved to set log.");
  }

  function adjustActiveRest(deltaSeconds) {
    if (!isRestRunning || !state.restStartedAt) return;

    const now = readTimerTimestamp();
    const elapsedSegment = Math.floor((now - state.restStartedAt) / 1000);
    const currentRemaining = Math.max(0, state.restRemainingAtStart - elapsedSegment);
    const remaining = Math.max(0, currentRemaining + deltaSeconds);
    const elapsed = state.restElapsedBeforeStart + elapsedSegment;

    if (remaining <= 0) {
      completeActiveRest("Rest completed", state.restDuration, elapsed);
      showToast("Rest complete. Start the next set.");
      showRestEndedAlert();
      return;
    }

    dispatch({
      type: timerActionTypes.restAdjusted,
      elapsed,
      remaining,
      startedAt: now,
    });
  }

  function completeRestFromClock(elapsed) {
    completeActiveRest("Rest completed", state.restDuration, elapsed);
    showToast("Rest complete. Start the next set.");
    showRestEndedAlert();
  }

  function completeActiveRest(status, resetSeconds, actualSeconds) {
    const setLogs = updateSetRest(state.setLogs, state.activeSetId, {
      status,
      endedAt: readTimerTimestamp(),
      actualSeconds,
      endedAtSessionSeconds: getCurrentWorkoutSeconds(),
    });

    dispatch({
      type: timerActionTypes.restReset,
      seconds: resetSeconds,
      setLogs,
      status: "done",
    });
  }

  function deleteCurrentSet(setId) {
    dispatch({
      type: timerActionTypes.setLogsChanged,
      setLogs: normalizeSetLogs(state.setLogs.filter((log) => log.id !== setId)),
      resetRest: state.activeSetId === setId,
      restDuration: state.restDuration,
    });
    showToast("Set deleted.");
  }

  function clearSetLogs() {
    dispatch({
      type: timerActionTypes.setLogsChanged,
      setLogs: [],
      resetRest: true,
      restDuration: state.restDuration,
    });
    showToast("Current set log cleared.");
  }

  function changeRestDurationInput(value) {
    const input = String(value).replace(/\D/g, "");
    const parsedSeconds = Number(input);
    const seconds = input !== "" && Number.isFinite(parsedSeconds) && parsedSeconds > 0
      ? Math.min(1800, Math.floor(parsedSeconds))
      : null;

    dispatch({
      type: timerActionTypes.restDurationChanged,
      input,
      seconds,
      syncIdle: !isRestRunning && !state.activeSetId,
    });
  }

  function commitRestDurationInput() {
    const seconds = clampSeconds(Number(state.restDurationInput));
    dispatch({
      type: timerActionTypes.restDurationChanged,
      input: String(seconds),
      seconds,
      syncIdle: !isRestRunning && !state.activeSetId,
    });
    return seconds;
  }

  function selectRestPreset(seconds) {
    const nextSeconds = clampSeconds(seconds);
    dispatch({
      type: timerActionTypes.restDurationChanged,
      input: String(nextSeconds),
      seconds: nextSeconds,
      syncIdle: !isRestRunning && !state.activeSetId,
    });
  }

  return {
    state: {
      activeSetId: state.activeSetId,
      autoStartRestAfterSet: timerSettings.autoStartRestAfterSet,
      confirmResetSession: timerSettings.confirmResetSession,
      finishDraft: state.finishDraft,
      hasActiveSession,
      isRestRunning,
      isSetPanelOpen: state.isSetPanelOpen,
      isWorkoutRunning,
      loggedSessionNotice: state.loggedSessionNotice,
      restAlert,
      restDuration: state.restDuration,
      restDurationInput: state.restDurationInput,
      restProgress,
      restRemaining: state.restRemaining,
      restStatus: state.restStatus,
      sessionReview: state.sessionReview,
      setLogs: state.setLogs,
      toast,
      totalRestSeconds,
      workoutElapsed: state.workoutElapsed,
      workoutStatus: state.workoutStatus,
      workoutSummary,
    },
    actions: {
      adjustActiveRest,
      cancelFinishWorkout,
      changeRestDurationInput,
      clearSetLogs,
      closeRestAlert,
      commitRestDurationInput,
      completeSetAndStartRest,
      deleteCurrentSet,
      finishWorkout,
      pauseRest,
      pauseWorkout,
      resetRest,
      resetWorkout,
      resumeRest,
      selectRestPreset,
      setIsSetPanelOpen: (isOpen) => dispatch({
        type: timerActionTypes.setPanelChanged,
        isOpen,
      }),
      setLoggedSessionNotice: (notice) => dispatch({
        type: timerActionTypes.loggedSessionNoticeChanged,
        notice,
      }),
      setSessionReview: (review) => dispatch({
        type: timerActionTypes.sessionReviewChanged,
        review,
      }),
      startWorkout,
      submitFinishWorkout,
    },
  };
}
