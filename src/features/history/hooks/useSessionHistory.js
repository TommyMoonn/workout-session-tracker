import { useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import {
  readWorkoutStorage,
  saveWorkoutStorage,
} from "../../../storage/workoutStorage";
import {
  createEmptyReview,
  normalizeReview,
  normalizeSetLogs,
} from "../../../utils/workoutData";
import {
  allWorkoutTypesValue,
  buildWorkoutTypeFilterOptions,
  matchesWorkoutTypeFilter,
} from "../../../domain/workoutTypes";
import {
  buildSessionMarkdown,
  downloadFile,
} from "../../../utils/workoutExport";
import { formatFileTimestamp } from "../../../utils/workoutFormat";
import { historyPageSize } from "../constants";

export function useSessionHistory() {
  const jsonInputRef = useRef(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const [sessionLogs, setSessionLogs] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [historyDisplayMode, setHistoryDisplayMode] = useState("card");
  const [historyPage, setHistoryPage] = useState(1);
  const [workoutTypeFilter, setWorkoutTypeFilter] =
    useState(allWorkoutTypesValue);
  const [editingSession, setEditingSession] = useState(null);
  const [editingReview, setEditingReview] = useState(createEmptyReview());
  const { toast, showToast } = useToast();

  const selectedSession = useMemo(
    () =>
      sessionLogs.find((session) => session.id === selectedSessionId) ?? null,
    [sessionLogs, selectedSessionId],
  );

  const workoutTypeFilterOptions = useMemo(
    () => buildWorkoutTypeFilterOptions(sessionLogs),
    [sessionLogs],
  );

  const filteredSessions = useMemo(
    () =>
      sessionLogs.filter((session) =>
        matchesWorkoutTypeFilter(session, workoutTypeFilter),
      ),
    [sessionLogs, workoutTypeFilter],
  );

  const totalHistoryPages = Math.max(
    1,
    Math.ceil(filteredSessions.length / historyPageSize),
  );
  const currentHistoryPage = Math.min(historyPage, totalHistoryPages);
  const pageSessionStart = (currentHistoryPage - 1) * historyPageSize;

  const visibleSessions = useMemo(
    () =>
      filteredSessions.slice(
        pageSessionStart,
        pageSessionStart + historyPageSize,
      ),
    [filteredSessions, pageSessionStart],
  );

  useEffect(() => {
    loadSavedState();
  }, []);

  useEffect(() => {
    if (historyPage <= totalHistoryPages) return;
    setHistoryPage(totalHistoryPages);
  }, [historyPage, totalHistoryPages]);

  useEffect(() => {
    if (
      workoutTypeFilterOptions.some(
        (option) => option.value === workoutTypeFilter,
      )
    )
      return;
    setWorkoutTypeFilter(allWorkoutTypesValue);
    setHistoryPage(1);
  }, [workoutTypeFilter, workoutTypeFilterOptions]);

  useEffect(() => {
    if (!hasLoadedStorage) return;

    const currentState = readWorkoutStorage();
    saveWorkoutStorage({
      ...currentState,
      savedAt: Date.now(),
      sessionLogs,
      selectedSessionId,
      historyDisplayMode,
      historyPage: currentHistoryPage,
      workoutTypeFilter,
    });
  }, [
    currentHistoryPage,
    hasLoadedStorage,
    historyDisplayMode,
    sessionLogs,
    selectedSessionId,
    workoutTypeFilter,
  ]);

  function loadSavedState() {
    const data = readWorkoutStorage();
    const savedSessions = Array.isArray(data?.sessionLogs)
      ? data.sessionLogs
      : [];
    const savedPage =
      Number.isInteger(data?.historyPage) && data.historyPage > 0
        ? data.historyPage
        : 1;

    setSessionLogs(savedSessions);
    setSelectedSessionId(null);
    setHistoryDisplayMode(
      data?.historyDisplayMode === "list" ? "list" : "card",
    );
    setWorkoutTypeFilter(
      typeof data?.workoutTypeFilter === "string"
        ? data.workoutTypeFilter
        : allWorkoutTypesValue,
    );
    setHistoryPage(savedPage);
    setHasLoadedStorage(true);
  }

  function deleteSessionSet(sessionId, setId) {
    setSessionLogs((current) =>
      current.map((session) => {
        if (session.id !== sessionId) return session;

        const nextSets = normalizeSetLogs(
          (session.sets || []).filter((set) => set.id !== setId),
        );
        const nextTotalRestSeconds = nextSets.reduce(
          (sum, set) => sum + (set.restActualSeconds ?? 0),
          0,
        );

        return {
          ...session,
          sets: nextSets,
          setCount: nextSets.length,
          totalRestSeconds: nextTotalRestSeconds,
        };
      }),
    );

    showToast("Set removed from saved session.");
  }

  function clearSessionLogs() {
    setSessionLogs([]);
    setSelectedSessionId(null);
    setHistoryDisplayMode("card");
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
    setSessionLogs((current) =>
      current.map((session) =>
        session.id === editingSession.id
          ? { ...session, review: nextReview }
          : session,
      ),
    );
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
      JSON.stringify(
        { exportedAt: new Date().toISOString(), sessionLogs },
        null,
        2,
      ),
      "application/json",
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
        const logs = Array.isArray(data?.sessionLogs)
          ? data.sessionLogs
          : Array.isArray(data)
            ? data
            : [];

        if (!logs.length) {
          showToast("JSON file has no workout sessions.");
          return;
        }

        setSessionLogs(logs);
        setSelectedSessionId(null);
        setWorkoutTypeFilter(allWorkoutTypesValue);
        setHistoryPage(1);
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
      "text/markdown",
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
      "text/markdown",
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
      workoutTypeFilter,
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
