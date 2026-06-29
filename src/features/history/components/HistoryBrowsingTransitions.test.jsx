import { useRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShortcutProvider } from "@features/settings";
import { HistoryArchive } from "./HistoryArchive";
import { HistoryListView } from "./HistoryListView";

const session = {
  id: "session-1",
  startedAt: 1_000,
  endedAt: 2_000,
  workoutSeconds: 60,
  totalRestSeconds: 30,
  setCount: 1,
  sets: [{
    id: "set-1",
    setNumber: 1,
    timeToCompleteSetSeconds: 30,
    completedAtSessionSeconds: 30,
    restTargetSeconds: 30,
    restActualSeconds: 30,
    restStartedAtSessionSeconds: 30,
    restEndedAtSessionSeconds: 60,
  }],
  review: {
    workoutTags: ["Strength"],
    thoughts: "",
    energy: 3,
    difficulty: 3,
    mood: 3,
    overallExperience: 3,
  },
};

const filterOptions = [{ value: "all", label: "All workouts" }];

describe("history browsing transitions", () => {
  it("restores archive focus and scroll position after viewing a session", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    vi.spyOn(window, "scrollY", "get").mockReturnValue(240);

    render(
      <ShortcutProvider>
        <HistoryHarness />
      </ShortcutProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Session 1/i }));

    const backButton = screen.getByRole("button", { name: /History/i });
    expect(document.activeElement).toBe(backButton);

    fireEvent.click(backButton);

    const restoredSession = screen.getByRole("button", { name: /Session 1/i });
    expect(document.activeElement).toBe(restoredSession);
    expect(restoredSession.getAttribute("aria-current")).toBe("true");
    expect(scrollTo).toHaveBeenCalledWith({
      top: 240,
      left: 0,
      behavior: "auto",
    });
  });

  it("replaces results while keeping pagination controls mounted", () => {
    const props = {
      displayMode: "list",
      filteredSessionCount: 7,
      onChangeDisplayMode: vi.fn(),
      onChangeWorkoutTypeFilter: vi.fn(),
      onNextPage: vi.fn(),
      onOpenSession: vi.fn(),
      onPreviousPage: vi.fn(),
      pageSessionStart: 0,
      selectedSessionId: null,
      selectedSessionRef: { current: null },
      totalPages: 2,
      workoutTypeFilter: "all",
      workoutTypeFilterOptions: filterOptions,
    };
    const { container, rerender } = render(
      <HistoryListView
        {...props}
        currentPage={1}
        visibleSessions={[session]}
      />
    );
    const previousButton = screen.getByRole("button", { name: "Prev" });
    const firstResults = container.querySelector(".oc-content-swap");

    rerender(
      <HistoryListView
        {...props}
        currentPage={2}
        pageSessionStart={6}
        visibleSessions={[{ ...session, id: "session-2" }]}
      />
    );

    expect(screen.getByRole("button", { name: "Prev" })).toBe(previousButton);
    expect(container.querySelector(".oc-content-swap")).not.toBe(firstResults);
  });
});

function HistoryHarness() {
  const [selectedSession, setSelectedSession] = useState(null);
  const jsonInputRef = useRef(null);
  const actions = {
    cancelEditSessionReview: vi.fn(),
    clearSessionLogs: vi.fn(),
    deleteSessionSet: vi.fn(),
    exportAllMarkdown: vi.fn(),
    exportSelectedMarkdown: vi.fn(),
    exportWorkoutHistoryJson: vi.fn(),
    importWorkoutHistoryJson: vi.fn(),
    nextHistoryPage: vi.fn(),
    openEditSessionReview: vi.fn(),
    openJsonImport: vi.fn(),
    previousHistoryPage: vi.fn(),
    saveEditSessionReview: vi.fn(),
    setEditingReview: vi.fn(),
    setHistoryDisplayMode: vi.fn(),
    setWorkoutTypeFilter: vi.fn(),
    openSessionDetail: () => setSelectedSession(session),
    closeSessionDetail: () => setSelectedSession(null),
  };

  return (
    <HistoryArchive
      actions={actions}
      refs={{ jsonInputRef }}
      state={{
        currentHistoryPage: 1,
        editingReview: null,
        editingSession: null,
        filteredSessionCount: 1,
        historyDisplayMode: "list",
        pageSessionStart: 0,
        selectedSession,
        sessionLogs: [session],
        toast: "",
        totalHistoryPages: 1,
        visibleSessions: [session],
        workoutTypeFilter: "all",
        workoutTypeFilterOptions: filterOptions,
      }}
    />
  );
}
