import { Button } from "../../../components/ui";
import { ui } from "../../../styles";

export function HistoryPagination({ currentPage, totalPages, onNextPage, onPreviousPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className={ui.historyPagination}>
      <Button variant="soft" className="!min-h-7 h-7 px-2 py-0 text-[11px] leading-none max-[520px]:w-auto" onClick={onPreviousPage} disabled={currentPage <= 1}>
        Prev
      </Button>
      <span className={ui.historyPageIndicator}>Page {currentPage} / {totalPages}</span>
      <Button variant="soft" className="!min-h-7 h-7 px-2 py-0 text-[11px] leading-none max-[520px]:w-auto" onClick={onNextPage} disabled={currentPage >= totalPages}>
        Next
      </Button>
    </div>
  );
}
