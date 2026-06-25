import { EmptyBlock, SelectField } from "../../../components/ui";
import { ui } from "../../../styles";
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
  totalPages,
  visibleSessions,
  workoutTypeFilter,
  workoutTypeFilterOptions,
}) {
  const hasVisibleSessions = visibleSessions.length > 0;

  return (
    <div className={ui.historyListView}>
      <div className={ui.historyListToolbar}>
        <div>
          <p className={ui.labelMarker}>Sessions</p>
          <h3 className={ui.smallTitle}>{filteredSessionCount} saved</h3>
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

      {hasVisibleSessions ? (
        <SessionList
          displayMode={displayMode}
          onOpenSession={onOpenSession}
          pageSessionStart={pageSessionStart}
          sessionCount={filteredSessionCount}
          visibleSessions={visibleSessions}
        />
      ) : (
        <div className="p-4">
          <EmptyBlock>No sessions match this tag.</EmptyBlock>
        </div>
      )}

      <HistoryPagination
        currentPage={currentPage}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        totalPages={totalPages}
      />
    </div>
  );
}
