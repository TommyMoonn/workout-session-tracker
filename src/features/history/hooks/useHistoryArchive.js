import { useRef } from "react";
import {
  buildSessionMarkdown,
  buildWorkoutHistoryExportPayload,
  downloadFile,
  formatFileTimestamp,
  parseWorkoutHistoryImport,
} from "@domain/workout";
import { historyActionTypes } from "../model/historyReducer";

export function useHistoryArchive({
  dispatch,
  selectedSession,
  sessionLogs,
  showToast,
}) {
  const jsonInputRef = useRef(null);

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

      dispatch({
        type: historyActionTypes.sessionsImported,
        sessions: importResult.sessions,
      });
      showToast(
        importResult.skippedCount > 0
          ? `Loaded ${importResult.sessions.length}; skipped ${importResult.skippedCount}.`
          : `${importResult.sessions.length} workout session(s) loaded.`
      );
      event.target.value = "";
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

  return {
    actions: {
      exportAllMarkdown,
      exportSelectedMarkdown,
      exportWorkoutHistoryJson,
      importWorkoutHistoryJson,
      openJsonImport,
    },
    refs: {
      jsonInputRef,
    },
  };
}
