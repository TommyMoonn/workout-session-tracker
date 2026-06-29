import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { formatDateTime, formatDuration, ReviewModal } from "@domain/workout";
import { ConfirmationDialog, EmptyState, Toast } from "@shared/ui";
import { useConfirmation } from "@shared/hooks";
import { cx } from "@shared/lib";
import { historyUi as ui } from "../styles";
import { useKeyboardShortcuts } from "@features/settings";
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
  const archiveScrollPositionRef = useRef(0);
  const backButtonRef = useRef(null);
  const [lastOpenedSessionId, setLastOpenedSessionId] = useState(null);
  const selectedSessionTriggerRef = useRef(null);
  const wasDetailViewRef = useRef(isDetailView);

  useLayoutEffect(() => {
    const wasDetailView = wasDetailViewRef.current;

    if (!wasDetailView && isDetailView) {
      backButtonRef.current?.focus({ preventScroll: true });
    }

    if (wasDetailView && !isDetailView) {
      window.scrollTo({
        top: archiveScrollPositionRef.current,
        left: 0,
        behavior: "auto",
      });
      selectedSessionTriggerRef.current?.focus({ preventScroll: true });
    }

    wasDetailViewRef.current = isDetailView;
  }, [isDetailView]);

  function openSessionDetail(sessionId) {
    archiveScrollPositionRef.current = window.scrollY;
    setLastOpenedSessionId(sessionId);
    actions.openSessionDetail(sessionId);
  }

  const closeSessionDetail = useCallback(function closeSessionDetail() {
    actions.closeSessionDetail();
  }, [actions]);

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
          closeSessionDetail();
        }
      },
    },
  ], [actions, closeSessionDetail, isDetailView, state.currentHistoryPage, state.editingSession, state.historyDisplayMode, state.totalHistoryPages]);

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
        ) : (
          <div
            key={isDetailView ? `detail:${state.selectedSession.id}` : "archive"}
            className={ui.historyArchiveContent}
          >
            {isDetailView ? (
              <HistoryDetailView
                backButtonRef={backButtonRef}
                session={state.selectedSession}
                onBack={closeSessionDetail}
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
                onOpenSession={openSessionDetail}
                onPreviousPage={actions.previousHistoryPage}
                pageSessionStart={state.pageSessionStart}
                selectedSessionId={lastOpenedSessionId}
                selectedSessionRef={selectedSessionTriggerRef}
                totalPages={state.totalHistoryPages}
                visibleSessions={state.visibleSessions}
                workoutTypeFilter={state.workoutTypeFilter}
                workoutTypeFilterOptions={state.workoutTypeFilterOptions}
              />
            )}
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
