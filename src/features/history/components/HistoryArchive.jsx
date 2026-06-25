import { ReviewModal } from "../../../components/session";
import { EmptyState, Toast } from "../../../components/ui";
import { ui } from "../../../styles";
import { formatDateTime, formatDuration } from "../../../utils/workoutFormat";
import { ArchiveActions } from "./ArchiveActions";
import { HistoryDetailView } from "./HistoryDetailView";
import { HistoryListView } from "./HistoryListView";
import { HistoryPageHeader } from "./HistoryPageHeader";

export function HistoryArchive({ state, actions, refs }) {
  const hasSessions = state.sessionLogs.length > 0;
  const isDetailView = Boolean(state.selectedSession);

  return (
    <div className={ui.page}>
      <HistoryPageHeader sessionCount={state.sessionLogs.length} />

      <section className={ui.historyCard}>
        <div className={ui.historyHeader}>
          <div>
            <p className="whitespace-nowrap text-xs font-bold uppercase leading-normal text-[var(--oc-muted)] oc-plus-before">Saved sessions</p>
            <h2 className={ui.sectionTitle}>Archive</h2>
          </div>

          <ArchiveActions
            hasSelectedSession={isDetailView}
            hasSessions={hasSessions}
            jsonInputRef={refs.jsonInputRef}
            onClear={actions.clearSessionLogs}
            onExportAllMarkdown={actions.exportAllMarkdown}
            onExportJson={actions.exportWorkoutHistoryJson}
            onExportSelectedMarkdown={actions.exportSelectedMarkdown}
            onImportJson={actions.importWorkoutHistoryJson}
            onOpenImport={actions.openJsonImport}
          />
        </div>

        {!hasSessions ? (
          <EmptyState text="No sessions logged yet. Finish a workout from the timer page to save the full session summary." />
        ) : isDetailView ? (
          <HistoryDetailView
            session={state.selectedSession}
            onBack={actions.closeSessionDetail}
            onDeleteSet={actions.deleteSessionSet}
            onEditReview={actions.openEditSessionReview}
          />
        ) : (
          <HistoryListView
            currentPage={state.currentHistoryPage}
            displayMode={state.historyDisplayMode}
            onChangeDisplayMode={actions.setHistoryDisplayMode}
            onNextPage={actions.nextHistoryPage}
            onOpenSession={actions.openSessionDetail}
            onPreviousPage={actions.previousHistoryPage}
            pageSessionStart={state.pageSessionStart}
            sessionCount={state.sessionLogs.length}
            totalPages={state.totalHistoryPages}
            visibleSessions={state.visibleSessions}
          />
        )}
      </section>

      {state.editingSession && (
        <ReviewModal
          mode="edit"
          title="Update workout review."
          subtitle={`${formatDateTime(state.editingSession.startedAt)} · ${formatDuration(state.editingSession.workoutSeconds)}`}
          review={state.editingReview}
          onChange={actions.setEditingReview}
          onCancel={actions.cancelEditSessionReview}
          onSave={actions.saveEditSessionReview}
        />
      )}

      <Toast message={state.toast} />
    </div>
  );
}
