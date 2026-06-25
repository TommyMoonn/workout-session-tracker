import { Button } from "../../../components/ui";
import { ui } from "../../../styles";

export function HistoryPagination({ currentPage, totalPages, onNextPage, onPreviousPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className={ui.historyPagination}>
      <Button variant="soft" className="min-h-9 px-3 py-0 text-xs" onClick={onPreviousPage} disabled={currentPage <= 1}>
        Prev
      </Button>
      <span className={ui.historyPageIndicator}>Page {currentPage} / {totalPages}</span>
      <Button variant="soft" className="min-h-9 px-3 py-0 text-xs" onClick={onNextPage} disabled={currentPage >= totalPages}>
        Next
      </Button>
    </div>
  );
}
