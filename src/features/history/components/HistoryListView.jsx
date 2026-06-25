import { ui } from "../../../styles";
import { HistoryPagination } from "./HistoryPagination";
import { HistoryViewToggle } from "./HistoryViewToggle";
import { SessionList } from "./SessionList";

export function HistoryListView({
  currentPage,
  displayMode,
  onChangeDisplayMode,
  onNextPage,
  onOpenSession,
  onPreviousPage,
  pageSessionStart,
  sessionCount,
  totalPages,
  visibleSessions,
}) {
  return (
    <div className={ui.historyListView}>
      <div className={ui.historyListToolbar}>
        <div>
          <p className={ui.labelMarker}>Sessions</p>
          <h3 className={ui.smallTitle}>{sessionCount} saved</h3>
        </div>

        <HistoryViewToggle value={displayMode} onChange={onChangeDisplayMode} />
      </div>

      <SessionList
        displayMode={displayMode}
        onOpenSession={onOpenSession}
        pageSessionStart={pageSessionStart}
        sessionCount={sessionCount}
        visibleSessions={visibleSessions}
      />

      <HistoryPagination
        currentPage={currentPage}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        totalPages={totalPages}
      />
    </div>
  );
}
