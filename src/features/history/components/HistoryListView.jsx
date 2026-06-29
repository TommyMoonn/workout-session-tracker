import { EmptyBlock, SelectField } from "@shared/ui";
import { cx } from "@shared/lib";
import { historyUi as ui } from "../styles";
import { HistoryPagination } from "./HistoryPagination";
import { HistoryViewToggle } from "./HistoryViewToggle";
import { SessionList } from "./SessionList";

export function HistoryListView({
  currentPage,
  displayMode,
  filteredSessionCount,
  onChangeDisplayMode,
  onChangeWorkoutTypeFilter,
  onNextPage,
  onOpenSession,
  onPreviousPage,
  pageSessionStart,
  selectedSessionId,
  selectedSessionRef,
  totalPages,
  visibleSessions,
  workoutTypeFilter,
  workoutTypeFilterOptions,
}) {
  const hasVisibleSessions = visibleSessions.length > 0;

  return (
    <div className={ui.historyListView}>
      <div className={cx(ui.historyListToolbar, ui.panelToolbarPadding)}>
        <div>
          <p className={ui.labelMarker}>Sessions</p>
          <h3 className={ui.panelTitle}>{filteredSessionCount} saved</h3>
        </div>

        <div className={ui.historyListTools}>
          <SelectField
            label="Workout tag"
            value={workoutTypeFilter}
            options={workoutTypeFilterOptions}
            onChange={onChangeWorkoutTypeFilter}
            className={ui.historyFilterField}
          />
          <HistoryViewToggle value={displayMode} onChange={onChangeDisplayMode} />
        </div>
      </div>

      <div
        key={`${displayMode}:${currentPage}:${workoutTypeFilter}`}
        className={ui.historyResultsSwap}
      >
        {hasVisibleSessions ? (
          <SessionList
            displayMode={displayMode}
            onOpenSession={onOpenSession}
            pageSessionStart={pageSessionStart}
            selectedSessionId={selectedSessionId}
            selectedSessionRef={selectedSessionRef}
            sessionCount={filteredSessionCount}
            visibleSessions={visibleSessions}
          />
        ) : (
          <EmptyBlock className={ui.historyListEmpty}>No sessions match this tag.</EmptyBlock>
        )}
      </div>

      <HistoryPagination
        currentPage={currentPage}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        totalPages={totalPages}
      />
    </div>
  );
}
