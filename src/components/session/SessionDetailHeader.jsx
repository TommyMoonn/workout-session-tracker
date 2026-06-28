import { MarkedPill } from "@shared/ui";
import { getWorkoutTags, getWorkoutTagsLabel, getWorkoutTypeLabel } from "../../domain/workoutTypes";
import { ui } from "@shared/styles";
import { formatDateTime, formatDuration } from "../../utils/workoutFormat";

export function SessionDetailHeader({ session }) {
  const workoutTags = getWorkoutTags(session);

  return (
    <header className={ui.sessionDetailHeader}>
      <div className="min-w-0">
        <p className={ui.labelMarker}>Selected session</p>
        <h3 className={ui.sessionDetailTitle}>{formatDateTime(session.startedAt)}</h3>
        <div className={ui.tagPillRow}>
          {workoutTags.length > 0 ? (
            workoutTags.map((tag) => (
              <MarkedPill key={tag} marker="[tag]">
                {getWorkoutTypeLabel(tag)}
              </MarkedPill>
            ))
          ) : (
            <MarkedPill marker="[tag]">{getWorkoutTagsLabel(workoutTags)}</MarkedPill>
          )}
        </div>
      </div>

      <div className={ui.sessionStatStrip} aria-label="Session totals">
        <SessionStat label="Workout" value={formatDuration(session.workoutSeconds)} />
        <SessionStat label="Rest" value={formatDuration(session.totalRestSeconds)} />
        <SessionStat label="Sets" value={String(session.setCount)} />
      </div>
    </header>
  );
}

function SessionStat({ label, value }) {
  return (
    <div className={ui.sessionStatItem}>
      <span className={ui.sessionStatLabel}>{label}</span>
      <strong className={ui.sessionStatValue}>{value}</strong>
    </div>
  );
}
