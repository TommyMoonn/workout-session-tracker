import { MarkedPill } from "@shared/ui";
import { cx } from "@shared/lib";
import { historyUi as ui } from "../styles";
import { formatDateTime, getWorkoutTags, getWorkoutTagsLabel } from "@domain/workout";
import { SessionSummaryCard } from "./SessionSummaryCard";

export function SessionList({
  displayMode = "list",
  onOpenSession,
  pageSessionStart = 0,
  selectedSessionId,
  selectedSessionRef,
  sessionCount,
  visibleSessions,
}) {
  return (
    <div className={displayMode === "card" ? ui.sessionCardGrid : ui.sessionListPanel}>
      {visibleSessions.map((session, index) => (
        <SessionSummaryItem
          displayMode={displayMode}
          index={index}
          key={session.id}
          onOpenSession={onOpenSession}
          pageSessionStart={pageSessionStart}
          selected={selectedSessionId === session.id}
          selectedSessionRef={selectedSessionRef}
          session={session}
          sessionCount={sessionCount}
        />
      ))}
    </div>
  );
}

function SessionSummaryItem({
  displayMode,
  index,
  onOpenSession,
  pageSessionStart,
  selected,
  selectedSessionRef,
  session,
  sessionCount,
}) {
  const workoutTags = getWorkoutTags(session);
  const workoutTagsLabel = getWorkoutTagsLabel(workoutTags);
  const sessionNumber = sessionCount - pageSessionStart - index;

  if (displayMode === "card") {
    return (
      <SessionSummaryCard
        onOpenSession={onOpenSession}
        ref={selected ? selectedSessionRef : undefined}
        selected={selected}
        session={session}
        sessionNumber={sessionNumber}
      />
    );
  }

  return (
    <button
      type="button"
      aria-current={selected ? "true" : undefined}
      onClick={() => onOpenSession(session.id)}
      ref={selected ? selectedSessionRef : undefined}
      className={cx(ui.sessionListButton, selected && ui.sessionListButtonSelected)}
    >
      <div className={ui.rowTop}>
        <div className="min-w-0">
          <p className={ui.labelMarker}>Session {sessionNumber}</p>
          <p className={ui.rowTitle}>{formatDateTime(session.startedAt)}</p>
          <p className={ui.sessionListMeta}>{workoutTagsLabel}</p>
        </div>
        <MarkedPill marker="[sets]" className="shrink-0">{session.setCount}</MarkedPill>
      </div>
    </button>
  );
}
