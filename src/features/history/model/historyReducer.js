import {
  allWorkoutTypesValue,
  createEmptyReview,
  normalizeReview,
  removeSetFromSessionLogs,
  updateSessionReview,
} from "@domain/workout";

export const historyActionTypes = {
  displayModeChanged: "displayModeChanged",
  filterChanged: "filterChanged",
  historyCleared: "historyCleared",
  nextPage: "nextPage",
  previousPage: "previousPage",
  reviewCanceled: "reviewCanceled",
  reviewChanged: "reviewChanged",
  reviewOpened: "reviewOpened",
  reviewSaved: "reviewSaved",
  sessionSelected: "sessionSelected",
  sessionsImported: "sessionsImported",
  setDeleted: "setDeleted",
};

export function createInitialHistoryState(data = {}) {
  return {
    editingReview: createEmptyReview(),
    editingSession: null,
    historyDisplayMode: data?.historyDisplayMode === "card" ? "card" : "list",
    historyPage: Number.isInteger(data?.historyPage) && data.historyPage > 0
      ? data.historyPage
      : 1,
    selectedSessionId: null,
    sessionLogs: Array.isArray(data?.sessionLogs) ? data.sessionLogs : [],
    workoutTypeFilter: typeof data?.workoutTypeFilter === "string"
      ? data.workoutTypeFilter
      : allWorkoutTypesValue,
  };
}

export function historyReducer(state, action) {
  switch (action.type) {
    case historyActionTypes.setDeleted:
      return {
        ...state,
        sessionLogs: removeSetFromSessionLogs(
          state.sessionLogs,
          action.sessionId,
          action.setId
        ),
      };
    case historyActionTypes.historyCleared:
      return {
        ...state,
        sessionLogs: [],
        selectedSessionId: null,
        workoutTypeFilter: allWorkoutTypesValue,
        historyPage: 1,
      };
    case historyActionTypes.reviewOpened:
      return {
        ...state,
        editingSession: action.session,
        editingReview: normalizeReview(action.session.review),
      };
    case historyActionTypes.reviewChanged:
      return { ...state, editingReview: action.review };
    case historyActionTypes.reviewSaved:
      if (!state.editingSession) return state;
      return {
        ...state,
        sessionLogs: updateSessionReview(
          state.sessionLogs,
          state.editingSession.id,
          state.editingReview
        ),
        editingSession: null,
        editingReview: createEmptyReview(),
      };
    case historyActionTypes.reviewCanceled:
      return {
        ...state,
        editingSession: null,
        editingReview: createEmptyReview(),
      };
    case historyActionTypes.sessionsImported:
      return {
        ...state,
        sessionLogs: action.sessions,
        selectedSessionId: null,
        workoutTypeFilter: allWorkoutTypesValue,
        historyPage: 1,
      };
    case historyActionTypes.sessionSelected:
      return { ...state, selectedSessionId: action.sessionId };
    case historyActionTypes.previousPage:
      return { ...state, historyPage: Math.max(1, state.historyPage - 1) };
    case historyActionTypes.nextPage:
      return {
        ...state,
        historyPage: Math.min(action.totalPages, state.historyPage + 1),
      };
    case historyActionTypes.displayModeChanged:
      if (action.displayMode === state.historyDisplayMode) return state;
      return {
        ...state,
        historyDisplayMode: action.displayMode,
        historyPage: Math.floor(action.pageSessionStart / action.pageSize) + 1,
      };
    case historyActionTypes.filterChanged:
      return {
        ...state,
        workoutTypeFilter: action.filter,
        historyPage: 1,
      };
    default:
      return state;
  }
}
