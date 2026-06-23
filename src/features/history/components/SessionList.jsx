import { Button, MarkedPill } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { formatDateTime, formatDuration } from "../../../utils/workoutFormat";
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
            className={cx(ui.rowButton, "[contain-intrinsic-size:116px]", isSelected && ui.rowSelected)}
          >
            <div className={ui.rowTop}>
              <div>
                <p className={ui.labelMarker}>Session {sessionCount - index}</p>
                <p className={ui.rowTitle}>{formatDateTime(session.startedAt)}</p>
              </div>
              <MarkedPill selected={isSelected}>{session.setCount} sets</MarkedPill>
            </div>
            <div className={cx(ui.rowMeta, isSelected && ui.rowMetaSelected)}>
              <span>Workout {formatDuration(session.workoutSeconds)}</span>
              <span>Rest {formatDuration(session.totalRestSeconds)}</span>
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
