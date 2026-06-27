import { useCallback, useEffect } from "react";
import { updateWorkoutStorage } from "../../../storage/workoutStorage";
import { storageSyncMs } from "../constants";

export function useWorkoutPersistence({
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
}) {
  const persistWorkoutStorage = useCallback(() => {
    updateWorkoutStorage({
      savedAt: Date.now(),
      sessionLogs,
      selectedSessionId,
      activeSession: buildActiveSessionSnapshot(),
    });
  }, [buildActiveSessionSnapshot, selectedSessionId, sessionLogs]);

  useEffect(() => {
    persistWorkoutStorage();
  }, [activeSetId, persistWorkoutStorage, restDuration, restDurationInput, restStatus, setLogs, workoutStatus]);

  useEffect(() => {
    if (!isWorkoutRunning && !isRestRunning) return undefined;

    const syncTimer = window.setInterval(() => {
      persistWorkoutStorage();
    }, storageSyncMs);

    return () => window.clearInterval(syncTimer);
  }, [isRestRunning, isWorkoutRunning, persistWorkoutStorage]);

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
  }, [persistWorkoutStorage]);
}
