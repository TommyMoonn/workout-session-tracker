import { useMemo } from "react";
import { ReviewModal } from "../../../components/session";
import { ConfirmationDialog, Toast } from "@shared/ui";
import { useConfirmation } from "@shared/hooks/useConfirmation";
import { cx } from "@shared/lib/cx";
import { ui } from "@shared/styles";
import { useKeyboardShortcuts } from "../../shortcuts";
import { formatDuration } from "../../../utils/workoutFormat";
import { RestCompletePopup } from "./RestCompletePopup";
import { RestFlowCard } from "./RestFlowCard";
import { SessionLoggedPopup } from "./SessionLoggedPopup";
import { SetLogDrawer } from "./SetLogDrawer";
import { TimerHeroCard } from "./TimerHeroCard";
import { TimerMetrics } from "./TimerMetrics";

export function TimerDashboard({ state, actions }) {
  const {
    cancelConfirmation,
    confirmation,
    confirmAction,
    requestConfirmation,
  } = useConfirmation();

  const timerShortcuts = useMemo(() => [
    {
      id: "timer.startPause",
      disabled: Boolean(state.finishDraft || state.loggedSessionNotice),
      handler: () => {
        if (state.isWorkoutRunning) {
          actions.pauseWorkout();
        } else {
          actions.startWorkout();
        }
      },
    },
    {
      id: "timer.completeSetRest",
      disabled: Boolean(state.finishDraft || state.loggedSessionNotice),
      handler: () => {
        if (state.isRestRunning) {
          actions.pauseRest();
        } else if (state.restStatus === "paused") {
          actions.resumeRest();
        } else {
          actions.completeSetAndStartRest();
        }
      },
    },
    {
      id: "timer.openSetLog",
      disabled: Boolean(state.finishDraft || state.loggedSessionNotice),
      handler: () => actions.setIsSetPanelOpen(!state.isSetPanelOpen),
    },
    {
      id: "timer.finishSession",
      disabled: !state.hasActiveSession || Boolean(state.finishDraft || state.loggedSessionNotice),
      handler: actions.finishWorkout,
    },
    {
      id: "global.close",
      allowInEditable: true,
      handler: () => {
        if (state.finishDraft) {
          actions.cancelFinishWorkout();
          return;
        }
        if (state.loggedSessionNotice) {
          actions.setLoggedSessionNotice(null);
          return;
        }
        if (state.isSetPanelOpen) {
          actions.setIsSetPanelOpen(false);
          return;
        }
        if (state.restAlert) {
          actions.closeRestAlert();
        }
      },
    },
  ], [actions, state.finishDraft, state.hasActiveSession, state.isRestRunning, state.isSetPanelOpen, state.isWorkoutRunning, state.loggedSessionNotice, state.restAlert, state.restStatus]);

  useKeyboardShortcuts(timerShortcuts);

  function resetWorkout() {
    if (!state.hasActiveSession || !state.confirmResetSession) {
      actions.resetWorkout();
      return;
    }

    requestConfirmation({
      title: "Reset active session?",
      message: "This clears the active workout timer, rest timer, and current set log. Saved history is not affected.",
      confirmLabel: "Reset session",
      onConfirm: actions.resetWorkout,
    });
  }

  function clearSetLogs() {
    if (state.setLogs.length === 0) return;

    requestConfirmation({
      title: "Clear current set log?",
      message: "This removes every set from the active workout. The workout timer will stay available.",
      confirmLabel: "Clear sets",
      onConfirm: actions.clearSetLogs,
    });
  }

  function deleteCurrentSet(setId) {
    requestConfirmation({
      title: "Delete this set?",
      message: "This removes the set from the current workout log and renumbers the remaining sets.",
      confirmLabel: "Delete set",
      onConfirm: () => actions.deleteCurrentSet(setId),
    });
  }

  return (
    <div className={ui.pageWide}>
      {state.restAlert && <RestCompletePopup onClose={actions.closeRestAlert} />}
      <main>
        <section className={cx(ui.timerLayoutGrid, ui.reveal)}>
          <TimerHeroCard
            className={ui.timerHeroArea}
            hasActiveSession={state.hasActiveSession}
            isWorkoutRunning={state.isWorkoutRunning}
            onFinishWorkout={actions.finishWorkout}
            onPauseWorkout={actions.pauseWorkout}
            onResetWorkout={resetWorkout}
            onStartWorkout={actions.startWorkout}
            workoutElapsed={state.workoutElapsed}
            workoutStatus={state.workoutStatus}
            workoutSummary={state.workoutSummary}
          />

          <RestFlowCard
            className={ui.timerRestArea}
            activeSetId={state.activeSetId}
            autoStartRestAfterSet={state.autoStartRestAfterSet}
            isRestRunning={state.isRestRunning}
            onAdjustActiveRest={actions.adjustActiveRest}
            onChangeRestDurationInput={actions.changeRestDurationInput}
            onCommitRestDurationInput={actions.commitRestDurationInput}
            onCompleteSetAndStartRest={actions.completeSetAndStartRest}
            onPauseRest={actions.pauseRest}
            onResetRest={actions.resetRest}
            onResumeRest={actions.resumeRest}
            onSelectRestPreset={actions.selectRestPreset}
            restDuration={state.restDuration}
            restDurationInput={state.restDurationInput}
            restProgress={state.restProgress}
            restRemaining={state.restRemaining}
            restStatus={state.restStatus}
          />
          <TimerMetrics
            className={ui.timerMetricsArea}
            onClearSetLogs={clearSetLogs}
            onOpenSetLog={() => actions.setIsSetPanelOpen(true)}
            setCount={state.setLogs.length}
            totalRestSeconds={state.totalRestSeconds}
            workoutElapsed={state.workoutElapsed}
          />
        </section>
      </main>

      {state.isSetPanelOpen && (
        <SetLogDrawer
          setLogs={state.setLogs}
          onClose={() => actions.setIsSetPanelOpen(false)}
          onClear={clearSetLogs}
          onDeleteSet={deleteCurrentSet}
        />
      )}

      {state.finishDraft && (
        <ReviewModal
          mode="finish"
          title="Add session notes."
          subtitle={`Workout ${formatDuration(state.finishDraft.workoutSeconds)} · Rest ${formatDuration(state.finishDraft.totalRestSeconds)} · ${state.finishDraft.setCount} sets`}
          review={state.sessionReview}
          onChange={actions.setSessionReview}
          onCancel={actions.cancelFinishWorkout}
          onSave={actions.submitFinishWorkout}
        />
      )}

      {state.loggedSessionNotice && (
        <SessionLoggedPopup
          session={state.loggedSessionNotice}
          onClose={() => actions.setLoggedSessionNotice(null)}
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
