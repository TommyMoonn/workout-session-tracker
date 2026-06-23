import { ui } from "../../styles";
import { formatDuration } from "../../utils/workoutFormat";
import { SessionReviewSummary } from "./SessionReviewSummary";
import { SetTable } from "./SetTable";

export function SessionDetail({ session, onDeleteSet, onEditReview }) {
  if (!session) return null;

  const sets = Array.isArray(session.sets) ? session.sets : [];

  return (
    <div className={ui.detailPane}>
      <div className={ui.detailMetrics}>
        <MiniMetric label="Workout time" value={formatDuration(session.workoutSeconds)} />
        <MiniMetric label="Total rest time" value={formatDuration(session.totalRestSeconds)} />
        <MiniMetric label="Sets" value={String(session.setCount)} />
      </div>

      <SessionReviewSummary session={session} onEditReview={() => onEditReview(session)} />

      <div className={ui.tablePanel}>
        <div className={ui.tableTitleMarked}>Sets inside this session</div>
        <div className={ui.tableScroll}>
          <SetTable
            sets={sets}
            emptyText="This session has no sets."
            onDeleteSet={(setId) => onDeleteSet(session.id, setId)}
          />
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className={ui.miniMetric}>
      <p className={ui.labelMarker}>{label}</p>
      <p className={ui.miniValue}>{value}</p>
    </div>
  );
}
