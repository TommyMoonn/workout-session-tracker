import { useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import { readWorkoutStorage, saveWorkoutStorage } from "../../../storage/workoutStorage";
import { createEmptyReview, normalizeReview, normalizeSetLogs } from "../../../utils/workoutData";
import { allWorkoutTypesValue, buildWorkoutTypeFilterOptions, matchesWorkoutTypeFilter } from "../../../domain/workoutTypes";
import { buildWorkoutHistoryExportPayload, parseWorkoutHistoryImport } from "../../../utils/workoutImport";
import { buildSessionMarkdown, downloadFile } from "../../../utils/workoutExport";
import { formatFileTimestamp } from "../../../utils/workoutFormat";
import { historyPageSize } from "../constants";

export function useSessionHistory() {
  const jsonInputRef = useRef(null);
  const [initialHistoryState] = useState(readInitialHistoryState);
  const [sessionLogs, setSessionLogs] = useState(initialHistoryState.sessionLogs);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [historyDisplayMode, setHistoryDisplayMode] = useState(initialHistoryState.historyDisplayMode);
  const [historyPage, setHistoryPage] = useState(initialHistoryState.historyPage);
  const [workoutTypeFilter, setWorkoutTypeFilter] = useState(initialHistoryState.workoutTypeFilter);
  const [editingSession, setEditingSession] = useState(null);
  const [editingReview, setEditingReview] = useState(createEmptyReview());
  const { toast, showToast } = useToast();

  const selectedSession = useMemo(() => (
    sessionLogs.find((session) => session.id === selectedSessionId) ?? null
  ), [sessionLogs, selectedSessionId]);

  const workoutTypeFilterOptions = useMemo(
    () => buildWorkoutTypeFilterOptions(sessionLogs),
    [sessionLogs]
  );

  const activeWorkoutTypeFilter = workoutTypeFilterOptions.some((option) => option.value === workoutTypeFilter)
    ? workoutTypeFilter
    : allWorkoutTypesValue;

  const filteredSessions = useMemo(
    () => sessionLogs.filter((session) => matchesWorkoutTypeFilter(session, activeWorkoutTypeFilter)),
    [activeWorkoutTypeFilter, sessionLogs]
  );

  const totalHistoryPages = Math.max(1, Math.ceil(filteredSessions.length / historyPageSize));
  const currentHistoryPage = Math.min(historyPage, totalHistoryPages);
  const pageSessionStart = (currentHistoryPage - 1) * historyPageSize;

  const visibleSessions = useMemo(
    () => filteredSessions.slice(pageSessionStart, pageSessionStart + historyPageSize),
    [filteredSessions, pageSessionStart]
  );

  useEffect(() => {
    const currentState = readWorkoutStorage();
    saveWorkoutStorage({
      ...currentState,
      savedAt: Date.now(),
      sessionLogs,
      selectedSessionId,
      historyDisplayMode,
      historyPage: currentHistoryPage,
      workoutTypeFilter: activeWorkoutTypeFilter,
    });
  }, [activeWorkoutTypeFilter, currentHistoryPage, historyDisplayMode, sessionLogs, selectedSessionId]);

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
    setHistoryDisplayMode("list");
    setWorkoutTypeFilter(allWorkoutTypesValue);
    setHistoryPage(1);
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
    const backup = buildWorkoutHistoryExportPayload(sessionLogs);

    if (backup.sessionLogs.length === 0) {
      showToast("No sessions to export yet.");
      return;
    }

    downloadFile(
      `workout-history-${formatFileTimestamp(Date.now())}.json`,
      JSON.stringify(backup, null, 2),
      "application/json"
    );
    showToast(`${backup.sessionLogs.length} session(s) exported.`);
  }

  function openJsonImport() {
    jsonInputRef.current?.click();
  }

  function importWorkoutHistoryJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const importResult = parseWorkoutHistoryImport(reader.result);

      if (!importResult.ok) {
        showToast(importResult.message);
        event.target.value = "";
        return;
      }

      setSessionLogs(importResult.sessions);
      setSelectedSessionId(null);
      setWorkoutTypeFilter(allWorkoutTypesValue);
      setHistoryPage(1);

      if (importResult.skippedCount > 0) {
        showToast(`Loaded ${importResult.sessions.length}; skipped ${importResult.skippedCount}.`);
      } else {
        showToast(`${importResult.sessions.length} workout session(s) loaded.`);
      }

      event.target.value = "";
    };
    reader.onerror = () => {
      showToast("Could not read JSON file.");
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  function openSessionDetail(sessionId) {
    setSelectedSessionId(sessionId);
  }

  function closeSessionDetail() {
    setSelectedSessionId(null);
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

  function previousHistoryPage() {
    setHistoryPage((current) => Math.max(1, current - 1));
  }

  function nextHistoryPage() {
    setHistoryPage((current) => Math.min(totalHistoryPages, current + 1));
  }

  return {
    state: {
      currentHistoryPage,
      editingReview,
      editingSession,
      historyDisplayMode,
      historyPageSize,
      pageSessionStart,
      filteredSessionCount: filteredSessions.length,
      selectedSession,
      sessionLogs,
      toast,
      totalHistoryPages,
      visibleSessions,
      workoutTypeFilter: activeWorkoutTypeFilter,
      workoutTypeFilterOptions,
    },
    refs: {
      jsonInputRef,
    },
    actions: {
      cancelEditSessionReview,
      closeSessionDetail,
      clearSessionLogs,
      deleteSessionSet,
      exportAllMarkdown,
      exportSelectedMarkdown,
      exportWorkoutHistoryJson,
      importWorkoutHistoryJson,
      nextHistoryPage,
      openEditSessionReview,
      openSessionDetail,
      openJsonImport,
      previousHistoryPage,
      saveEditSessionReview,
      setEditingReview,
      setHistoryDisplayMode,
      setSelectedSessionId,
      setWorkoutTypeFilter: (nextFilter) => {
        setWorkoutTypeFilter(nextFilter);
        setHistoryPage(1);
      },
    },
  };
}

function readInitialHistoryState() {
  const data = readWorkoutStorage();

  return {
    sessionLogs: Array.isArray(data?.sessionLogs) ? data.sessionLogs : [],
    historyDisplayMode: data?.historyDisplayMode === "card" ? "card" : "list",
    historyPage: Number.isInteger(data?.historyPage) && data.historyPage > 0 ? data.historyPage : 1,
    workoutTypeFilter: typeof data?.workoutTypeFilter === "string" ? data.workoutTypeFilter : allWorkoutTypesValue,
  };
}
