import { describe, expect, it } from "vitest";
import {
  createInitialHistoryState,
  historyActionTypes,
  historyReducer,
} from "./historyReducer";
import { selectHistoryView } from "./historySelectors";

function createSessions(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `session-${index + 1}`,
    review: {
      workoutTags: index % 2 === 0 ? ["Strength"] : ["Cardio"],
    },
    sets: [],
  }));
}

describe("history model", () => {
  it("normalizes persisted view state", () => {
    expect(createInitialHistoryState({
      historyDisplayMode: "unknown",
      historyPage: -1,
      sessionLogs: "invalid",
      workoutTypeFilter: null,
    })).toMatchObject({
      historyDisplayMode: "list",
      historyPage: 1,
      sessionLogs: [],
      workoutTypeFilter: "all",
    });
  });

  it("uses six list rows and nine cards per page", () => {
    const sessions = createSessions(12);

    const listView = selectHistoryView(createInitialHistoryState({
      historyDisplayMode: "list",
      historyPage: 2,
      sessionLogs: sessions,
    }));
    const cardView = selectHistoryView(createInitialHistoryState({
      historyDisplayMode: "card",
      historyPage: 2,
      sessionLogs: sessions,
    }));

    expect(listView).toMatchObject({
      currentHistoryPage: 2,
      historyPageSize: 6,
      pageSessionStart: 6,
      totalHistoryPages: 2,
    });
    expect(listView.visibleSessions).toHaveLength(6);
    expect(cardView).toMatchObject({
      currentHistoryPage: 2,
      historyPageSize: 9,
      pageSessionStart: 9,
      totalHistoryPages: 2,
    });
    expect(cardView.visibleSessions).toHaveLength(3);
  });

  it("preserves the current result position when display mode changes", () => {
    const state = createInitialHistoryState({
      historyDisplayMode: "list",
      historyPage: 2,
      sessionLogs: createSessions(15),
    });
    const nextState = historyReducer(state, {
      type: historyActionTypes.displayModeChanged,
      displayMode: "card",
      pageSessionStart: 6,
      pageSize: 9,
    });
    const view = selectHistoryView(nextState);

    expect(nextState).toMatchObject({
      historyDisplayMode: "card",
      historyPage: 1,
    });
    expect(view.visibleSessions.map((session) => session.id)).toContain("session-7");
  });

  it("resets pagination when filtering and clamps pages after data changes", () => {
    const state = createInitialHistoryState({
      historyPage: 2,
      sessionLogs: createSessions(12),
    });
    const filteredState = historyReducer(state, {
      type: historyActionTypes.filterChanged,
      filter: "Strength",
    });
    const view = selectHistoryView(filteredState);

    expect(filteredState.historyPage).toBe(1);
    expect(view.filteredSessionCount).toBe(6);
    expect(view.currentHistoryPage).toBe(1);
  });
});
