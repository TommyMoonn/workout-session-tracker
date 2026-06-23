import { ReviewModal, SessionDetail } from "../../../components/session";
import { EmptyState, Toast } from "../../../components/ui";
import { ui } from "../../../styles";
import { formatDateTime, formatDuration } from "../../../utils/workoutFormat";
import { ArchiveActions } from "./ArchiveActions";
import { HistoryPageHeader } from "./HistoryPageHeader";
import { SessionList } from "./SessionList";

export function HistoryArchive({ state, actions, refs }) {
  const hasSessions = state.sessionLogs.length > 0;

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
            hasSelectedSession={Boolean(state.selectedSession)}
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
        ) : (
          <div className={ui.browserBody}>
            <SessionList
              hasMoreSessions={state.hasMoreSessions}
              onSelectSession={actions.setSelectedSessionId}
              onShowMore={actions.showMoreSessions}
              selectedSession={state.selectedSession}
              sessionCount={state.sessionLogs.length}
              visibleSessionCount={state.visibleSessionCount}
              visibleSessions={state.visibleSessions}
            />

            <SessionDetail
              session={state.selectedSession}
              onDeleteSet={actions.deleteSessionSet}
              onEditReview={actions.openEditSessionReview}
            />
          </div>
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
