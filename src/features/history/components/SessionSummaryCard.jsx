import { forwardRef } from "react";
import { MarkedPill } from "@shared/ui";
import { cx } from "@shared/lib";
import { formatDateTime, getWorkoutTags, getWorkoutTagsLabel } from "@domain/workout";
import { historyUi as ui } from "../styles";

export const SessionSummaryCard = forwardRef(function SessionSummaryCard({
  onOpenSession,
  selected = false,
  session,
  sessionNumber,
}, ref) {
  const workoutTagsLabel = getWorkoutTagsLabel(getWorkoutTags(session));

  return (
    <button
      type="button"
      aria-current={selected ? "true" : undefined}
      onClick={() => onOpenSession(session.id)}
      ref={ref}
      className={cx(ui.sessionCardButton, selected && ui.sessionCardButtonSelected)}
    >
      <div className={ui.sessionCardTop}>
        <p className={ui.labelMarker}>Session {sessionNumber}</p>
        <MarkedPill marker="[sets]" className="shrink-0">{session.setCount}</MarkedPill>
      </div>
      <p className={ui.sessionCardTitle}>{formatDateTime(session.startedAt)}</p>
      <p className={ui.sessionCardMeta}>{workoutTagsLabel}</p>
    </button>
  );
});
