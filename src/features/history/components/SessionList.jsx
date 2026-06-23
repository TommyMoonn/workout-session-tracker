import { Button, MarkedPill } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { formatDateTime } from "../../../utils/workoutFormat";
import { sessionLoadStep } from "../constants";

export function SessionList({
  hasMoreSessions,
  onSelectSession,
  onShowMore,
  selectedSession,
  sessionCount,
  visibleSessionCount,
  visibleSessions,
}) {
  return (
    <div className={ui.listPanel}>
      {visibleSessions.map((session, index) => {
        const isSelected = selectedSession?.id === session.id;

        return (
          <button
            key={session.id}
            type="button"
            onClick={() => onSelectSession(session.id)}
            className={cx(ui.rowButton, "[contain-intrinsic-size:92px]", isSelected && ui.rowSelected)}
          >
            <div className={ui.rowTop}>
              <div>
                <p className={ui.labelMarker}>Session {sessionCount - index}</p>
                <p className={ui.rowTitle}>{formatDateTime(session.startedAt)}</p>
              </div>
              <MarkedPill selected={isSelected} className="shrink-0">{session.setCount} sets</MarkedPill>
            </div>
          </button>
        );
      })}

      {hasMoreSessions && (
        <div className="p-4">
          <Button variant="soft" onClick={onShowMore}>
            Show {Math.min(sessionLoadStep, sessionCount - visibleSessionCount)} more
          </Button>
        </div>
      )}
    </div>
  );
}
