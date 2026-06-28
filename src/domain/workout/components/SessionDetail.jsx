import { ui } from "@shared/styles";
import { SessionDetailHeader } from "./SessionDetailHeader";
import { SessionReviewSummary } from "./SessionReviewSummary";
import { SetTable } from "./SetTable";

export function SessionDetail({ session, onDeleteSet, onEditReview }) {
  if (!session) return null;

  const sets = Array.isArray(session.sets) ? session.sets : [];

  return (
    <div className={ui.detailPane}>
      <SessionDetailHeader session={session} />

      <SessionReviewSummary session={session} onEditReview={() => onEditReview(session)} />

      <div className={ui.tablePanel}>
        <div className={ui.tableTitleMarked}>Sets</div>
        <div
          aria-label="Saved set details"
          className={ui.tableScroll}
          role="region"
          tabIndex={0}
        >
          <SetTable
            sets={sets}
            emptyText="No sets logged."
            onDeleteSet={(setId) => onDeleteSet(session.id, setId)}
          />
        </div>
      </div>
    </div>
  );
}
