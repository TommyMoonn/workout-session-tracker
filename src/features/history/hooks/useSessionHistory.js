import { useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { readWorkoutStorage, saveWorkoutStorage } from "../../../storage/workoutStorage";
import { createEmptyReview, normalizeReview, normalizeSetLogs } from "../../../utils/workoutData";
import { buildSessionMarkdown, downloadFile } from "../../../utils/workoutExport";
import { formatFileTimestamp } from "../../../utils/workoutFormat";
import { initialVisibleSessionCount, sessionLoadStep } from "../constants";

export function useSessionHistory() {
  const jsonInputRef = useRef(null);
  const storageLoadedRef = useRef(false);

  const [sessionLogs, setSessionLogs] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [editingReview, setEditingReview] = useState(createEmptyReview());
  const [visibleSessionCount, setVisibleSessionCount] = useState(initialVisibleSessionCount);
  const { toast, showToast } = useToast();

  const selectedSession = useMemo(() => (
    sessionLogs.find((session) => session.id === selectedSessionId) ?? sessionLogs[0] ?? null
  ), [sessionLogs, selectedSessionId]);

  const visibleSessions = useMemo(
    () => sessionLogs.slice(0, visibleSessionCount),
    [sessionLogs, visibleSessionCount]
  );

  const hasMoreSessions = visibleSessionCount < sessionLogs.length;

  useEffect(() => {
    loadSavedState();
  }, []);

  useEffect(() => {
    if (!storageLoadedRef.current) return;

    const currentState = readWorkoutStorage();
    saveWorkoutStorage({
      ...currentState,
      savedAt: Date.now(),
      sessionLogs,
      selectedSessionId,
    });
  }, [sessionLogs, selectedSessionId]);

  function loadSavedState() {
    const data = readWorkoutStorage();
    const savedSessions = Array.isArray(data?.sessionLogs) ? data.sessionLogs : [];

    setSessionLogs(savedSessions);
    setSelectedSessionId(data?.selectedSessionId ?? savedSessions[0]?.id ?? null);
    setVisibleSessionCount(initialVisibleSessionCount);
    storageLoadedRef.current = true;
  }

  function deleteSessionSet(sessionId, setId) {
    setSessionLogs((current) => current.map((session) => {
      if (session.id !== sessionId) return session;

      const nextSets = normalizeSetLogs((session.sets || []).filter((set) => set.id !== setId));
      const nextTotalRestSeconds = nextSets.reduce((sum, set) => sum + (set.restActualSeconds ?? 0), 0);

      return {
        ...session,
        sets: nextSets,
        setCount: nextSets.length,
        totalRestSeconds: nextTotalRestSeconds,
      };
    }));

    showToast("Set removed from saved session.");
  }

  function clearSessionLogs() {
    setSessionLogs([]);
    setSelectedSessionId(null);
    setVisibleSessionCount(initialVisibleSessionCount);
    showToast("Session history cleared.");
  }

  function openEditSessionReview(session) {
    if (!session) return;
    setEditingSession(session);
    setEditingReview(normalizeReview(session.review));
  }

  function saveEditSessionReview() {
    if (!editingSession) return;

    const nextReview = normalizeReview(editingReview);
    setSessionLogs((current) => current.map((session) => (
      session.id === editingSession.id ? { ...session, review: nextReview } : session
    )));
    setEditingSession(null);
    setEditingReview(createEmptyReview());
    showToast("Session notes updated.");
  }

  function cancelEditSessionReview() {
    setEditingSession(null);
    setEditingReview(createEmptyReview());
  }

  function exportWorkoutHistoryJson() {
    if (sessionLogs.length === 0) {
      showToast("No sessions to export yet.");
      return;
    }

    downloadFile(
      `workout-history-${formatFileTimestamp(Date.now())}.json`,
      JSON.stringify({ exportedAt: new Date().toISOString(), sessionLogs }, null, 2),
      "application/json"
    );
    showToast("Workout history JSON exported.");
  }

  function openJsonImport() {
    jsonInputRef.current?.click();
  }

  function importWorkoutHistoryJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || "{}"));
        const logs = Array.isArray(data?.sessionLogs) ? data.sessionLogs : Array.isArray(data) ? data : [];

        if (!logs.length) {
          showToast("JSON file has no workout sessions.");
          return;
        }

        setSessionLogs(logs);
        setSelectedSessionId(logs[0]?.id ?? null);
        setVisibleSessionCount(initialVisibleSessionCount);
        showToast(`${logs.length} workout session(s) loaded.`);
      } catch (error) {
        console.error(error);
        showToast("Invalid workout JSON file.");
      } finally {
        event.target.value = "";
      }
    };
    reader.onerror = () => {
      showToast("Could not read JSON file.");
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  function exportSelectedMarkdown() {
    const session = selectedSession ?? sessionLogs[0];
    if (!session) {
      showToast("No sessions to export yet.");
      return;
    }

    downloadFile(
      `workout-session-${formatFileTimestamp(session.endedAt)}.md`,
      buildSessionMarkdown(session),
      "text/markdown"
    );
    showToast("Selected markdown exported.");
  }

  function exportAllMarkdown() {
    if (sessionLogs.length === 0) {
      showToast("No sessions to export yet.");
      return;
    }

    downloadFile(
      `workout-sessions-${formatFileTimestamp(Date.now())}.md`,
      sessionLogs.map(buildSessionMarkdown).join("\n\n---\n\n"),
      "text/markdown"
    );
    showToast("All sessions markdown exported.");
  }

  function showMoreSessions() {
    setVisibleSessionCount((current) => current + sessionLoadStep);
  }

  return {
    state: {
      editingReview,
      editingSession,
      hasMoreSessions,
      selectedSession,
      sessionLogs,
      toast,
      visibleSessionCount,
      visibleSessions,
    },
    refs: {
      jsonInputRef,
    },
    actions: {
      cancelEditSessionReview,
      clearSessionLogs,
      deleteSessionSet,
      exportAllMarkdown,
      exportSelectedMarkdown,
      exportWorkoutHistoryJson,
      importWorkoutHistoryJson,
      openEditSessionReview,
      openJsonImport,
      saveEditSessionReview,
      setEditingReview,
      setSelectedSessionId,
      showMoreSessions,
    },
  };
}
