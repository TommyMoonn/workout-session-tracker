import { useEffect, useState } from "react";
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
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    loadSavedState();
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;

    persistWorkoutStorage();
  }, [
    hasLoadedStorage,
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
    if (!hasLoadedStorage || (!isWorkoutRunning && !isRestRunning)) return undefined;

    const syncTimer = window.setInterval(() => {
      persistWorkoutStorage();
    }, storageSyncMs);

    return () => window.clearInterval(syncTimer);
  }, [
    hasLoadedStorage,
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
    hasLoadedStorage,
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
    if (!hasLoadedStorage) return;

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
        setHasLoadedStorage(true);
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
      setHasLoadedStorage(true);
    }
  }
}
