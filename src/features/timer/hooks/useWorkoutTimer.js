import { useEffect, useMemo, useRef, useState } from "react";
import { createEmptyReview, normalizeReview, normalizeSetLogs } from "../../../utils/workoutData";
import { readWorkoutStorage, saveWorkoutStorage } from "../../../storage/workoutStorage";
import { clampSeconds } from "../../../utils/workoutFormat";
import {
  defaultRestSeconds,
  timerTickMs,
} from "../constants";
import { useToast } from "../../../hooks/useToast";
import { useTimerSettings } from "../../timerSettings";
import { useRestAlarm } from "./useRestAlarm";
import { useWorkoutPersistence } from "./useWorkoutPersistence";

export function useWorkoutTimer() {
  const workoutTickerRef = useRef(null);
  const restTickerRef = useRef(null);
  const completeActiveRestRef = useRef(null);
  const getCurrentWorkoutSecondsRef = useRef(null);
  const showRestEndedAlertRef = useRef(null);
  const showToastRef = useRef(null);
  const stopRestAlarmRef = useRef(null);
  const [initialTimerState] = useState(readInitialWorkoutTimerState);
  const [workoutStartedAt, setWorkoutStartedAt] = useState(initialTimerState.workoutStartedAt);
  const [workoutElapsedBeforeStart, setWorkoutElapsedBeforeStart] = useState(initialTimerState.workoutElapsedBeforeStart);
  const [workoutElapsed, setWorkoutElapsed] = useState(initialTimerState.workoutElapsed);
  const [workoutStatus, setWorkoutStatus] = useState(initialTimerState.workoutStatus);

  const [restDuration, setRestDuration] = useState(initialTimerState.restDuration);
  const [restDurationInput, setRestDurationInput] = useState(initialTimerState.restDurationInput);
  const [restRemaining, setRestRemaining] = useState(initialTimerState.restRemaining);
  const [restStartedAt, setRestStartedAt] = useState(initialTimerState.restStartedAt);
  const [restRemainingAtStart, setRestRemainingAtStart] = useState(initialTimerState.restRemainingAtStart);
  const [restElapsedBeforeStart, setRestElapsedBeforeStart] = useState(initialTimerState.restElapsedBeforeStart);
  const [restStatus, setRestStatus] = useState(initialTimerState.restStatus);
  const [activeSetId, setActiveSetId] = useState(initialTimerState.activeSetId);

  const [setLogs, setSetLogs] = useState(initialTimerState.setLogs);
  const [sessionLogs, setSessionLogs] = useState(initialTimerState.sessionLogs);
  const [selectedSessionId, setSelectedSessionId] = useState(initialTimerState.selectedSessionId);

  const { toast, showToast } = useToast();
  const { settings: timerSettings } = useTimerSettings();
  const { restAlert, closeRestAlert, showRestEndedAlert, stopRestAlarm } = useRestAlarm();
  const [isSetPanelOpen, setIsSetPanelOpen] = useState(false);
  const [finishDraft, setFinishDraft] = useState(null);
  const [loggedSessionNotice, setLoggedSessionNotice] = useState(null);
  const [sessionReview, setSessionReview] = useState(createEmptyReview());

  const isWorkoutRunning = workoutStatus === "running";
  const isRestRunning = restStatus === "running";
  const hasActiveSession = workoutElapsed > 0 || workoutStatus === "running" || workoutStatus === "paused" || setLogs.length > 0;

  const totalRestSeconds = useMemo(
    () => setLogs.reduce((sum, log) => sum + (log.restActualSeconds ?? 0), 0),
    [setLogs]
  );

  const restProgress = useMemo(() => {
    if (!restDuration) return 0;
    return Math.min(100, Math.max(0, ((restDuration - restRemaining) / restDuration) * 100));
  }, [restDuration, restRemaining]);

  const workoutSummary = useMemo(() => {
    const minutes = Math.floor(workoutElapsed / 60);
    if (minutes < 10) return "Warm-up window";
    if (minutes < 35) return "Main workout active";
    if (minutes < 60) return "Strong session";
    return "Long session";
  }, [workoutElapsed]);

  useWorkoutPersistence({
    activeSetId,
    buildActiveSessionSnapshot,
    isRestRunning,
    isWorkoutRunning,
    restDuration,
    restDurationInput,
    restStatus,
    selectedSessionId,
    sessionLogs,
    setLogs,
    workoutStatus,
  });

  useEffect(() => {
    completeActiveRestRef.current = completeActiveRest;
    getCurrentWorkoutSecondsRef.current = getCurrentWorkoutSeconds;
    showRestEndedAlertRef.current = showRestEndedAlert;
    showToastRef.current = showToast;
    stopRestAlarmRef.current = stopRestAlarm;
  });

  useEffect(() => {
    if (isRestRunning || activeSetId) return undefined;

    const defaultRestSyncTimer = window.setTimeout(() => {
      const nextSeconds = timerSettings.defaultRestSeconds;
      setRestDuration(nextSeconds);
      setRestDurationInput(String(nextSeconds));
      setRestRemaining(nextSeconds);
      setRestRemainingAtStart(nextSeconds);
      setRestStatus("idle");
    }, 0);

    return () => window.clearTimeout(defaultRestSyncTimer);
  }, [activeSetId, isRestRunning, timerSettings.defaultRestSeconds]);

  useEffect(() => () => {
    window.clearInterval(workoutTickerRef.current);
    window.clearInterval(restTickerRef.current);
    stopRestAlarmRef.current?.();
  }, []);

  useEffect(() => {
    window.clearInterval(workoutTickerRef.current);
    window.clearInterval(restTickerRef.current);

    const shouldTickWorkout = isWorkoutRunning && workoutStartedAt;
    const shouldTickRest = isRestRunning && restStartedAt;

    if (!shouldTickWorkout && !shouldTickRest) return undefined;

    workoutTickerRef.current = window.setInterval(() => {
      if (shouldTickWorkout) {
        const nextElapsed = getCurrentWorkoutSecondsRef.current?.() ?? 0;
        setWorkoutElapsed((current) => (current === nextElapsed ? current : nextElapsed));
      }

      if (shouldTickRest) {
        const elapsed = Math.floor((Date.now() - restStartedAt) / 1000);
        const nextRemaining = Math.max(0, restRemainingAtStart - elapsed);

        setRestRemaining((current) => (current === nextRemaining ? current : nextRemaining));

        if (nextRemaining <= 0) {
          window.clearInterval(workoutTickerRef.current);
          completeActiveRestRef.current?.("Rest completed");
          showToastRef.current?.("Rest complete. Start the next set.");
          showRestEndedAlertRef.current?.();
        }
      }
    }, timerTickMs);

    return () => window.clearInterval(workoutTickerRef.current);
  }, [
    isWorkoutRunning,
    workoutStartedAt,
    workoutElapsedBeforeStart,
    isRestRunning,
    restStartedAt,
    restRemainingAtStart,
  ]);

  function getCurrentWorkoutSeconds() {
    if (!workoutStartedAt) return workoutElapsedBeforeStart;
    return workoutElapsedBeforeStart + Math.floor((Date.now() - workoutStartedAt) / 1000);
  }

  function getCurrentRestSeconds() {
    if (!restStartedAt) return restElapsedBeforeStart;
    return restElapsedBeforeStart + Math.floor((Date.now() - restStartedAt) / 1000);
  }

  function buildActiveSessionSnapshot() {
    const currentWorkoutElapsed = workoutStatus === "running"
      ? getCurrentWorkoutSeconds()
      : workoutElapsed;
    const currentRestRemaining = restStatus === "running" && restStartedAt
      ? Math.max(0, restRemainingAtStart - Math.floor((Date.now() - restStartedAt) / 1000))
      : restRemaining;

    return {
      workoutElapsed: currentWorkoutElapsed,
      workoutStatus,
      restDuration,
      restDurationInput,
      restRemaining: currentRestRemaining,
      restStatus,
      activeSetId,
      setLogs,
    };
  }

  function startWorkout() {
    setWorkoutStartedAt(Date.now());
    setWorkoutStatus("running");
  }

  function pauseWorkout() {
    const nextElapsed = getCurrentWorkoutSeconds();

    setWorkoutElapsedBeforeStart(nextElapsed);
    setWorkoutElapsed(nextElapsed);
    setWorkoutStartedAt(null);
    setWorkoutStatus("paused");
  }

  function resetWorkout() {
    window.clearInterval(workoutTickerRef.current);
    window.clearInterval(restTickerRef.current);
    closeRestAlert();

    setWorkoutStartedAt(null);
    setWorkoutElapsedBeforeStart(0);
    setWorkoutElapsed(0);
    setWorkoutStatus("idle");
    setSetLogs([]);
    resetRestState(restDuration);
    showToast("Workout session reset.");
  }

  function finishWorkout() {
    const endedAt = Date.now();
    const finalWorkoutSeconds = getCurrentWorkoutSeconds();
    const finalSetLogs = setLogs.map((log) => {
      if (log.id !== activeSetId) return log;
      return {
        ...log,
        restEndedAt: endedAt,
        restEndedAtSessionSeconds: finalWorkoutSeconds,
        restActualSeconds: Math.max(0, getCurrentRestSeconds()),
        status: "Session finished",
      };
    });

    const finalTotalRestSeconds = finalSetLogs.reduce((sum, log) => sum + (log.restActualSeconds ?? 0), 0);

    window.clearInterval(workoutTickerRef.current);
    window.clearInterval(restTickerRef.current);

    setWorkoutStartedAt(null);
    setWorkoutElapsedBeforeStart(finalWorkoutSeconds);
    setWorkoutElapsed(finalWorkoutSeconds);
    setWorkoutStatus("paused");

    setFinishDraft({
      id: `session-${endedAt}`,
      startedAt: endedAt - finalWorkoutSeconds * 1000,
      endedAt,
      workoutSeconds: finalWorkoutSeconds,
      totalRestSeconds: finalTotalRestSeconds,
      setCount: finalSetLogs.length,
      sets: normalizeSetLogs(finalSetLogs),
    });
    setSessionReview(createEmptyReview());
  }

  function submitFinishWorkout() {
    if (!finishDraft) return;

    const session = {
      ...finishDraft,
      review: normalizeReview(sessionReview),
    };
    const nextSessionLogs = [
      session,
      ...sessionLogs.filter((savedSession) => savedSession.id !== session.id),
    ];

    saveLoggedSession(nextSessionLogs, session.id);
    setSessionLogs(nextSessionLogs);
    setSelectedSessionId(session.id);
    setFinishDraft(null);
    setSessionReview(createEmptyReview());
    resetAfterSessionLogged();
    setLoggedSessionNotice({
      id: session.id,
      workoutSeconds: session.workoutSeconds,
      totalRestSeconds: session.totalRestSeconds,
      setCount: session.setCount,
    });
  }

  function saveLoggedSession(nextSessionLogs, nextSelectedSessionId) {
    const currentState = readWorkoutStorage();

    saveWorkoutStorage({
      ...currentState,
      savedAt: Date.now(),
      sessionLogs: nextSessionLogs,
      selectedSessionId: nextSelectedSessionId,
      activeSession: buildResetActiveSessionSnapshot(restDuration),
    });
  }

  function buildResetActiveSessionSnapshot(seconds) {
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

  function cancelFinishWorkout() {
    setFinishDraft(null);
    showToast("Session finish cancelled. Workout is paused.");
  }

  function resetAfterSessionLogged() {
    setWorkoutStartedAt(null);
    setWorkoutElapsedBeforeStart(0);
    setWorkoutElapsed(0);
    setWorkoutStatus("idle");
    setSetLogs([]);
    resetRestState(restDuration);
  }

  function completeSetAndStartRest() {
    const now = Date.now();
    const wasIdle = workoutStatus === "idle" || workoutStatus === "finished";
    const sessionSeconds = wasIdle ? 0 : getCurrentWorkoutSeconds();
    const shouldAutoStartRest = timerSettings.autoStartRestAfterSet;

    if (wasIdle) {
      setWorkoutStartedAt(now);
      setWorkoutElapsedBeforeStart(0);
      setWorkoutElapsed(0);
      setWorkoutStatus("running");
    }

    if (activeSetId) {
      updateActiveSetRest("Replaced by next set", now, getCurrentRestSeconds(), sessionSeconds);
    }

    const previousSet = setLogs[setLogs.length - 1];
    const previousRestEndSeconds = previousSet ? previousSet.restEndedAtSessionSeconds ?? sessionSeconds : 0;
    const setNumber = setLogs.length + 1;
    const setId = `${now}-${setNumber}`;
    const safeRestSeconds = commitRestDurationInput();

    setSetLogs((current) => [
      ...current,
      {
        id: setId,
        setNumber,
        completedAt: now,
        completedAtSessionSeconds: sessionSeconds,
        timeToCompleteSetSeconds: Math.max(0, sessionSeconds - previousRestEndSeconds),
        restTargetSeconds: safeRestSeconds,
        restStartedAt: shouldAutoStartRest ? now : null,
        restStartedAtSessionSeconds: shouldAutoStartRest ? sessionSeconds : null,
        restEndedAt: null,
        restEndedAtSessionSeconds: null,
        restActualSeconds: null,
        status: shouldAutoStartRest ? "Resting" : "Set logged",
      },
    ]);

    if (shouldAutoStartRest) {
      startRestForSet(setId, safeRestSeconds, now);
      showToast(`Set ${setNumber} logged. Rest started.`);
      return;
    }

    resetRestState(safeRestSeconds);
    showToast(`Set ${setNumber} logged.`);
  }

  function startRestForSet(setId, seconds, timestamp) {
    window.clearInterval(restTickerRef.current);

    setRestDuration(seconds);
    setRestDurationInput(String(seconds));
    setRestRemaining(seconds);
    setRestRemainingAtStart(seconds);
    setRestElapsedBeforeStart(0);
    setRestStartedAt(timestamp);
    setActiveSetId(setId);
    setRestStatus("running");
  }

  function pauseRest() {
    if (!restStartedAt) return;

    const elapsedSegment = Math.floor((Date.now() - restStartedAt) / 1000);
    const nextElapsed = restElapsedBeforeStart + elapsedSegment;
    const nextRemaining = Math.max(0, restRemainingAtStart - elapsedSegment);

    setRestElapsedBeforeStart(nextElapsed);
    setRestRemaining(nextRemaining);
    setRestRemainingAtStart(nextRemaining);
    setRestStartedAt(null);
    setRestStatus(nextRemaining > 0 ? "paused" : "done");
  }

  function resumeRest() {
    if (restRemaining <= 0 || !activeSetId) return;

    setRestRemainingAtStart(restRemaining);
    setRestStartedAt(Date.now());
    setRestStatus("running");
  }

  function resetRest() {
    if (!activeSetId) {
      resetRestState(restDuration);
      return;
    }

    updateActiveSetRest("Rest stopped", Date.now(), getCurrentRestSeconds(), getCurrentWorkoutSeconds());
    resetRestState(restDuration);
    showToast("Rest stopped and saved to set log.");
  }

  function adjustActiveRest(deltaSeconds) {
    if (!isRestRunning || !restStartedAt) return;

    const now = Date.now();
    const elapsedSegment = Math.floor((now - restStartedAt) / 1000);
    const currentRemaining = Math.max(0, restRemainingAtStart - elapsedSegment);
    const nextRemaining = Math.max(0, currentRemaining + deltaSeconds);
    const nextElapsedBeforeStart = restElapsedBeforeStart + elapsedSegment;

    if (nextRemaining <= 0) {
      setRestRemaining(0);
      completeActiveRest("Rest completed");
      showToast("Rest complete. Start the next set.");
      showRestEndedAlert();
      return;
    }

    setRestRemaining(nextRemaining);
    setRestRemainingAtStart(nextRemaining);
    setRestElapsedBeforeStart(nextElapsedBeforeStart);
    setRestStartedAt(now);
  }

  function completeActiveRest(status, resetSeconds = restDuration) {
    updateActiveSetRest(status, Date.now(), getCurrentRestSeconds(), getCurrentWorkoutSeconds());
    resetRestState(resetSeconds, "done");
  }

  function updateActiveSetRest(status, endedAt, actualSeconds, endedAtSessionSeconds = getCurrentWorkoutSeconds()) {
    const setId = activeSetId;
    if (!setId) return;

    setSetLogs((current) => current.map((log) => (
      log.id === setId
        ? {
          ...log,
          restEndedAt: endedAt,
          restEndedAtSessionSeconds: endedAtSessionSeconds,
          restActualSeconds: Math.max(0, actualSeconds),
          status,
        }
        : log
    )));
  }

  function resetRestState(seconds, status = "idle") {
    window.clearInterval(restTickerRef.current);
    setRestRemaining(seconds);
    setRestRemainingAtStart(seconds);
    setRestElapsedBeforeStart(0);
    setRestStartedAt(null);
    setActiveSetId(null);
    setRestStatus(status);
  }

  function deleteCurrentSet(setId) {
    setSetLogs((current) => normalizeSetLogs(current.filter((log) => log.id !== setId)));

    if (activeSetId === setId) {
      resetRestState(restDuration);
    }

    showToast("Set deleted.");
  }

  function clearSetLogs() {
    setSetLogs([]);
    resetRestState(restDuration);
    showToast("Current set log cleared.");
  }

  function changeRestDurationInput(value) {
    const nextValue = String(value).replace(/\D/g, "");
    setRestDurationInput(nextValue);

    if (nextValue === "") return;

    const parsedSeconds = Number(nextValue);
    if (!Number.isFinite(parsedSeconds) || parsedSeconds <= 0) return;

    const nextSeconds = Math.min(1800, Math.floor(parsedSeconds));
    setRestDuration(nextSeconds);

    if (!isRestRunning && !activeSetId) {
      setRestRemaining(nextSeconds);
      setRestRemainingAtStart(nextSeconds);
      setRestStatus("idle");
    }
  }

  function commitRestDurationInput() {
    const nextSeconds = clampSeconds(Number(restDurationInput));
    setRestDuration(nextSeconds);
    setRestDurationInput(String(nextSeconds));

    if (!isRestRunning && !activeSetId) {
      setRestRemaining(nextSeconds);
      setRestRemainingAtStart(nextSeconds);
      setRestStatus("idle");
    }

    return nextSeconds;
  }

  function selectRestPreset(seconds) {
    const nextSeconds = clampSeconds(seconds);
    setRestDuration(nextSeconds);
    setRestDurationInput(String(nextSeconds));

    if (!isRestRunning && !activeSetId) {
      setRestRemaining(nextSeconds);
      setRestRemainingAtStart(nextSeconds);
      setRestStatus("idle");
    }
  }



  return {
    state: {
      activeSetId,
      autoStartRestAfterSet: timerSettings.autoStartRestAfterSet,
      finishDraft,
      hasActiveSession,
      isRestRunning,
      isSetPanelOpen,
      isWorkoutRunning,
      loggedSessionNotice,
      restAlert,
      restDuration,
      restDurationInput,
      restProgress,
      restRemaining,
      restStatus,
      sessionReview,
      setLogs,
      toast,
      totalRestSeconds,
      workoutElapsed,
      workoutStatus,
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
      setIsSetPanelOpen,
      setLoggedSessionNotice,
      setSessionReview,
      startWorkout,
      submitFinishWorkout,
    },
  };
}

function readInitialWorkoutTimerState() {
  const fallback = {
    activeSetId: null,
    restDuration: defaultRestSeconds,
    restDurationInput: String(defaultRestSeconds),
    restElapsedBeforeStart: 0,
    restRemaining: defaultRestSeconds,
    restRemainingAtStart: defaultRestSeconds,
    restStartedAt: null,
    restStatus: "idle",
    selectedSessionId: null,
    sessionLogs: [],
    setLogs: [],
    workoutElapsed: 0,
    workoutElapsedBeforeStart: 0,
    workoutStartedAt: null,
    workoutStatus: "idle",
  };

  try {
    const data = readWorkoutStorage();
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
      activeSetId: activeSession.activeSetId ?? null,
      restDuration: savedRestDuration,
      restDurationInput: String(activeSession.restDurationInput || savedRestDuration),
      restElapsedBeforeStart: Math.max(0, savedRestDuration - savedRestRemaining),
      restRemaining: savedRestRemaining,
      restRemainingAtStart: savedRestRemaining,
      restStartedAt: null,
      restStatus: ["idle", "paused", "done"].includes(savedRestStatus) ? savedRestStatus : "idle",
      selectedSessionId: data?.selectedSessionId ?? savedSessions[0]?.id ?? null,
      sessionLogs: savedSessions,
      setLogs: Array.isArray(activeSession.setLogs) ? activeSession.setLogs : [],
      workoutElapsed: savedWorkoutElapsed,
      workoutElapsedBeforeStart: savedWorkoutElapsed,
      workoutStartedAt: null,
      workoutStatus: ["idle", "paused", "finished"].includes(savedWorkoutStatus) ? savedWorkoutStatus : "idle",
    };
  } catch (error) {
    console.error(error);
    return fallback;
  }
}
