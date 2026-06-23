import { useEffect, useRef } from "react";
import { readWorkoutStorage, saveWorkoutStorage } from "../../../storage/workoutStorage";
import { storageSyncMs } from "../constants";

export function useWorkoutPersistence({
  activeSetId,
  buildActiveSessionSnapshot,
  isRestRunning,
  isWorkoutRunning,
  restDuration,
  restDurationInput,
  restRemainingAtStart,
  restStartedAt,
  restStatus,
  selectedSessionId,
  sessionLogs,
  setLogs,
  showToast,
  restoreActiveSession,
  setSelectedSessionId,
  setSessionLogs,
  workoutElapsedBeforeStart,
  workoutStartedAt,
  workoutStatus,
}) {
  const storageLoadedRef = useRef(false);

  useEffect(() => {
    loadSavedState();
  }, []);

  useEffect(() => {
    persistWorkoutStorage();
  }, [
    sessionLogs,
    selectedSessionId,
    workoutStatus,
    restDuration,
    restDurationInput,
    restStatus,
    activeSetId,
    setLogs,
  ]);

  useEffect(() => {
    if (!storageLoadedRef.current || (!isWorkoutRunning && !isRestRunning)) return undefined;

    const syncTimer = window.setInterval(() => {
      persistWorkoutStorage();
    }, storageSyncMs);

    return () => window.clearInterval(syncTimer);
  }, [
    isWorkoutRunning,
    isRestRunning,
    sessionLogs,
    selectedSessionId,
    workoutStatus,
    restDuration,
    restDurationInput,
    restStatus,
    activeSetId,
    setLogs,
  ]);

  useEffect(() => {
    const persistBeforePageHide = () => persistWorkoutStorage();
    const persistWhenHidden = () => {
      if (document.visibilityState === "hidden") persistWorkoutStorage();
    };

    window.addEventListener("pagehide", persistBeforePageHide);
    document.addEventListener("visibilitychange", persistWhenHidden);

    return () => {
      window.removeEventListener("pagehide", persistBeforePageHide);
      document.removeEventListener("visibilitychange", persistWhenHidden);
    };
  }, [
    sessionLogs,
    selectedSessionId,
    workoutStartedAt,
    workoutElapsedBeforeStart,
    workoutStatus,
    restDuration,
    restDurationInput,
    restStartedAt,
    restRemainingAtStart,
    restStatus,
    activeSetId,
    setLogs,
  ]);

  function persistWorkoutStorage() {
    if (!storageLoadedRef.current) return;

    saveWorkoutStorage({
      savedAt: Date.now(),
      sessionLogs,
      selectedSessionId,
      activeSession: buildActiveSessionSnapshot(),
    });
  }

  function loadSavedState() {
    try {
      const data = readWorkoutStorage();
      if (!Object.keys(data).length) {
        storageLoadedRef.current = true;
        return;
      }
      const savedSessions = Array.isArray(data?.sessionLogs) ? data.sessionLogs : [];

      setSessionLogs(savedSessions);
      setSelectedSessionId(data?.selectedSessionId ?? savedSessions[0]?.id ?? null);
      restoreActiveSession(data?.activeSession);
    } catch (error) {
      console.error(error);
      showToast("Could not load saved workout data.");
    } finally {
      storageLoadedRef.current = true;
    }
  }
}
