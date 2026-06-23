import { ReviewModal } from "../../../components/session";
import { Toast } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { formatDuration } from "../../../utils/workoutFormat";
import { RestCompletePopup } from "./RestCompletePopup";
import { RestFlowCard } from "./RestFlowCard";
import { SessionLoggedPopup } from "./SessionLoggedPopup";
import { SetLogDrawer } from "./SetLogDrawer";
import { TimerHeroCard } from "./TimerHeroCard";
import { TimerMetrics } from "./TimerMetrics";

export function TimerDashboard({ state, actions }) {
  return (
    <div className={ui.page}>
      <main>
        <section className={cx(ui.timerLayoutGrid, ui.reveal)}>
          <TimerHeroCard
            className={ui.timerHeroArea}
            hasActiveSession={state.hasActiveSession}
            isWorkoutRunning={state.isWorkoutRunning}
            onFinishWorkout={actions.finishWorkout}
            onPauseWorkout={actions.pauseWorkout}
            onResetWorkout={actions.resetWorkout}
            onStartWorkout={actions.startWorkout}
            workoutElapsed={state.workoutElapsed}
            workoutStatus={state.workoutStatus}
            workoutSummary={state.workoutSummary}
          />

          <RestFlowCard
            className={ui.timerRestArea}
            activeSetId={state.activeSetId}
            isRestRunning={state.isRestRunning}
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
            onClearSetLogs={actions.clearSetLogs}
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
          onClear={actions.clearSetLogs}
          onDeleteSet={actions.deleteCurrentSet}
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

      {state.restAlert && <RestCompletePopup onClose={actions.closeRestAlert} />}
      <Toast message={state.toast} />
    </div>
  );
}
