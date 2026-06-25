import { MarkedPill } from "../../../components/ui";
import { ui } from "../../../styles";
import { formatDateTime } from "../../../utils/workoutFormat";
import { normalizeReview } from "../../../utils/workoutData";

export function SessionList({
  displayMode = "list",
  onOpenSession,
  pageSessionStart = 0,
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
          session={session}
          sessionCount={sessionCount}
        />
      ))}
    </div>
  );
}

function SessionSummaryItem({ displayMode, index, onOpenSession, pageSessionStart, session, sessionCount }) {
  const review = normalizeReview(session.review);
  const workoutType = review.workoutType.trim();
  const sessionNumber = sessionCount - pageSessionStart - index;

  if (displayMode === "card") {
    return (
      <button
        type="button"
        onClick={() => onOpenSession(session.id)}
        className={ui.sessionCardButton}
      >
        <div className={ui.sessionCardTop}>
          <p className={ui.labelMarker}>Session {sessionNumber}</p>
          <MarkedPill marker="[sets]" className="shrink-0">{session.setCount}</MarkedPill>
        </div>
        <p className={ui.sessionCardTitle}>{formatDateTime(session.startedAt)}</p>
        {workoutType && <p className={ui.sessionCardMeta}>{workoutType}</p>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpenSession(session.id)}
      className={ui.sessionListButton}
    >
      <div className={ui.rowTop}>
        <div className="min-w-0">
          <p className={ui.labelMarker}>Session {sessionNumber}</p>
          <p className={ui.rowTitle}>{formatDateTime(session.startedAt)}</p>
          {workoutType && <p className={ui.sessionListMeta}>{workoutType}</p>}
        </div>
        <MarkedPill marker="[sets]" className="shrink-0">{session.setCount}</MarkedPill>
      </div>
    </button>
  );
}
