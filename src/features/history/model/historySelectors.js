import {
  allWorkoutTypesValue,
  buildWorkoutTypeFilterOptions,
  matchesWorkoutTypeFilter,
} from "@domain/workout";
import { getHistoryPageSize } from "../constants";

export function selectHistoryView(state) {
  const workoutTypeFilterOptions = buildWorkoutTypeFilterOptions(state.sessionLogs);
  const workoutTypeFilter = workoutTypeFilterOptions.some(
    (option) => option.value === state.workoutTypeFilter
  )
    ? state.workoutTypeFilter
    : allWorkoutTypesValue;
  const filteredSessions = state.sessionLogs.filter(
    (session) => matchesWorkoutTypeFilter(session, workoutTypeFilter)
  );
  const historyPageSize = getHistoryPageSize(state.historyDisplayMode);
  const totalHistoryPages = Math.max(
    1,
    Math.ceil(filteredSessions.length / historyPageSize)
  );
  const currentHistoryPage = Math.min(state.historyPage, totalHistoryPages);
  const pageSessionStart = (currentHistoryPage - 1) * historyPageSize;

  return {
    currentHistoryPage,
    filteredSessionCount: filteredSessions.length,
    historyPageSize,
    pageSessionStart,
    selectedSession: state.sessionLogs.find(
      (session) => session.id === state.selectedSessionId
    ) ?? null,
    totalHistoryPages,
    visibleSessions: filteredSessions.slice(
      pageSessionStart,
      pageSessionStart + historyPageSize
    ),
    workoutTypeFilter,
    workoutTypeFilterOptions,
  };
}
