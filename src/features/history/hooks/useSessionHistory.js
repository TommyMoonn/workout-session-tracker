import { useEffect, useMemo, useReducer } from "react";
import { readWorkoutStorage, updateWorkoutStorage } from "@domain/workout";
import { useToast } from "@shared/hooks/useToast";
import { getHistoryPageSize } from "../constants";
import {
  createInitialHistoryState,
  historyActionTypes,
  historyReducer,
} from "../model/historyReducer";
import { selectHistoryView } from "../model/historySelectors";
import { useHistoryArchive } from "./useHistoryArchive";
import { useHistoryReview } from "./useHistoryReview";

export function useSessionHistory() {
  const [state, dispatch] = useReducer(
    historyReducer,
    undefined,
    () => createInitialHistoryState(readWorkoutStorage())
  );
  const { toast, showToast } = useToast();
  const view = useMemo(() => selectHistoryView(state), [state]);
  const reviewActions = useHistoryReview({
    dispatch,
    editingSession: state.editingSession,
    showToast,
  });
  const archive = useHistoryArchive({
    dispatch,
    selectedSession: view.selectedSession,
    sessionLogs: state.sessionLogs,
    showToast,
  });

  useEffect(() => {
    updateWorkoutStorage({
      savedAt: Date.now(),
      sessionLogs: state.sessionLogs,
      selectedSessionId: state.selectedSessionId,
      historyDisplayMode: state.historyDisplayMode,
      historyPage: view.currentHistoryPage,
      workoutTypeFilter: view.workoutTypeFilter,
    });
  }, [
    state.historyDisplayMode,
    state.selectedSessionId,
    state.sessionLogs,
    view.currentHistoryPage,
    view.workoutTypeFilter,
  ]);

  function deleteSessionSet(sessionId, setId) {
    dispatch({
      type: historyActionTypes.setDeleted,
      sessionId,
      setId,
    });
    showToast("Set removed from saved session.");
  }

  function clearSessionLogs() {
    dispatch({ type: historyActionTypes.historyCleared });
    showToast("Session history cleared.");
  }

  function openSessionDetail(sessionId) {
    setSelectedSessionId(sessionId);
  }

  function closeSessionDetail() {
    setSelectedSessionId(null);
  }

  function setSelectedSessionId(sessionId) {
    dispatch({
      type: historyActionTypes.sessionSelected,
      sessionId,
    });
  }

  function previousHistoryPage() {
    dispatch({ type: historyActionTypes.previousPage });
  }

  function nextHistoryPage() {
    dispatch({
      type: historyActionTypes.nextPage,
      totalPages: view.totalHistoryPages,
    });
  }

  function changeHistoryDisplayMode(displayMode) {
    dispatch({
      type: historyActionTypes.displayModeChanged,
      displayMode,
      pageSessionStart: view.pageSessionStart,
      pageSize: getHistoryPageSize(displayMode),
    });
  }

  function setWorkoutTypeFilter(filter) {
    dispatch({
      type: historyActionTypes.filterChanged,
      filter,
    });
  }

  return {
    state: {
      currentHistoryPage: view.currentHistoryPage,
      editingReview: state.editingReview,
      editingSession: state.editingSession,
      historyDisplayMode: state.historyDisplayMode,
      historyPageSize: view.historyPageSize,
      pageSessionStart: view.pageSessionStart,
      filteredSessionCount: view.filteredSessionCount,
      selectedSession: view.selectedSession,
      sessionLogs: state.sessionLogs,
      toast,
      totalHistoryPages: view.totalHistoryPages,
      visibleSessions: view.visibleSessions,
      workoutTypeFilter: view.workoutTypeFilter,
      workoutTypeFilterOptions: view.workoutTypeFilterOptions,
    },
    refs: archive.refs,
    actions: {
      ...archive.actions,
      ...reviewActions,
      closeSessionDetail,
      clearSessionLogs,
      deleteSessionSet,
      nextHistoryPage,
      openSessionDetail,
      previousHistoryPage,
      setHistoryDisplayMode: changeHistoryDisplayMode,
      setSelectedSessionId,
      setWorkoutTypeFilter,
    },
  };
}
