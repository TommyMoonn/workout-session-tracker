import { Button } from "@shared/ui";
import { SessionDetail } from "@domain/workout";
import { historyUi as ui } from "../styles";

export function HistoryDetailView({ onBack, onDeleteSet, onEditReview, session }) {
  return (
    <div className={ui.historyDetailView}>
      <div className={ui.historyDetailToolbar}>
        <Button variant="soft" onClick={onBack} className="max-[520px]:w-auto">
          ← History
        </Button>
      </div>

      <SessionDetail
        session={session}
        onDeleteSet={onDeleteSet}
        onEditReview={onEditReview}
      />
    </div>
  );
}
