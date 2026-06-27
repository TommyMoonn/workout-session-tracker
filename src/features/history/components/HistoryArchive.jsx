import { useMemo } from "react";
import { ReviewModal } from "../../../components/session";
import { ConfirmationDialog, EmptyState, Toast } from "../../../components/ui";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { useKeyboardShortcuts } from "../../shortcuts";
import { formatDateTime, formatDuration } from "../../../utils/workoutFormat";
import { ArchiveActions } from "./ArchiveActions";
import { HistoryDetailView } from "./HistoryDetailView";
import { HistoryListView } from "./HistoryListView";
import { HistoryPageHeader } from "./HistoryPageHeader";

export function HistoryArchive({ state, actions, refs }) {
  const {
    cancelConfirmation,
    confirmation,
    confirmAction,
    requestConfirmation,
  } = useConfirmation();
  const hasSessions = state.sessionLogs.length > 0;
  const isDetailView = Boolean(state.selectedSession);
  const historyShortcuts = useMemo(() => [
    {
      id: "history.listView",
      disabled: isDetailView || state.editingSession || state.historyDisplayMode === "list",
      handler: () => actions.setHistoryDisplayMode("list"),
    },
    {
      id: "history.cardView",
      disabled: isDetailView || state.editingSession || state.historyDisplayMode === "card",
      handler: () => actions.setHistoryDisplayMode("card"),
    },
    {
      id: "history.previousPage",
      disabled: isDetailView || state.editingSession || state.currentHistoryPage <= 1,
      handler: actions.previousHistoryPage,
    },
    {
      id: "history.nextPage",
      disabled: isDetailView || state.editingSession || state.currentHistoryPage >= state.totalHistoryPages,
      handler: actions.nextHistoryPage,
    },
    {
      id: "global.close",
      allowInEditable: true,
      handler: () => {
        if (state.editingSession) {
          actions.cancelEditSessionReview();
          return;
        }
        if (isDetailView) {
          actions.closeSessionDetail();
        }
      },
    },
  ], [actions, isDetailView, state.currentHistoryPage, state.editingSession, state.historyDisplayMode, state.totalHistoryPages]);

  useKeyboardShortcuts(historyShortcuts);

  function clearSessionLogs() {
    if (!hasSessions) return;

    requestConfirmation({
      title: "Clear session history?",
      message: "This deletes every saved workout session from this browser. Export a backup first if you need to keep them.",
      confirmLabel: "Clear history",
      onConfirm: actions.clearSessionLogs,
    });
  }

  function deleteSessionSet(sessionId, setId) {
    requestConfirmation({
      title: "Delete this saved set?",
      message: "This removes the set from the saved session and updates that session's set count and total rest time.",
      confirmLabel: "Delete set",
      onConfirm: () => actions.deleteSessionSet(sessionId, setId),
    });
  }

  return (
    <div className={ui.pageWide}>
      <HistoryPageHeader sessionCount={state.sessionLogs.length} />

      <section className={ui.historyCard}>
        <div className={cx(ui.historyHeader, ui.panelPadding)}>
          <div>
            <p className="whitespace-nowrap text-xs font-bold uppercase leading-normal text-[var(--oc-muted)] oc-plus-before">Saved sessions</p>
            <h2 className={ui.panelTitle}>Archive</h2>
          </div>

          <ArchiveActions
            hasSelectedSession={isDetailView}
            hasSessions={hasSessions}
            jsonInputRef={refs.jsonInputRef}
            onClear={clearSessionLogs}
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
            onDeleteSet={deleteSessionSet}
            onEditReview={actions.openEditSessionReview}
          />
        ) : (
          <HistoryListView
            currentPage={state.currentHistoryPage}
            displayMode={state.historyDisplayMode}
            filteredSessionCount={state.filteredSessionCount}
            onChangeDisplayMode={actions.setHistoryDisplayMode}
            onChangeWorkoutTypeFilter={actions.setWorkoutTypeFilter}
            onNextPage={actions.nextHistoryPage}
            onOpenSession={actions.openSessionDetail}
            onPreviousPage={actions.previousHistoryPage}
            pageSessionStart={state.pageSessionStart}
            totalPages={state.totalHistoryPages}
            visibleSessions={state.visibleSessions}
            workoutTypeFilter={state.workoutTypeFilter}
            workoutTypeFilterOptions={state.workoutTypeFilterOptions}
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

      {confirmation && (
        <ConfirmationDialog
          {...confirmation}
          onCancel={cancelConfirmation}
          onConfirm={confirmAction}
        />
      )}

      <Toast message={state.toast} />
    </div>
  );
}
