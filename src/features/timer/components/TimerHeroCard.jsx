import { Button } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { formatDuration } from "../../../utils/workoutFormat";

export function TimerHeroCard({
  hasActiveSession,
  isWorkoutRunning,
  onFinishWorkout,
  onPauseWorkout,
  onResetWorkout,
  onStartWorkout,
  workoutElapsed,
  workoutStatus,
  workoutSummary,
  className = "",
}) {
  const statusLabel = isWorkoutRunning ? "Running" : workoutStatus === "paused" ? "Paused" : "Ready";

  return (
    <div className={cx(ui.card, ui.cardPadding, className)}>
      <div className={ui.timerHeroHeader}>
        <div>
          <p className={ui.labelMarker}>Timer</p>
          <h1 className={ui.heroTitle}>Track your workout.</h1>
        </div>
        <span className={cx(ui.timerStatusBadge, isWorkoutRunning && ui.timerStatusBadgeRunning)}>
          {statusLabel}
        </span>
      </div>

      <hr className={ui.divider} />

      <div className={ui.timerPanel}>
        <div className={ui.rowBetween}>
          <span className={ui.labelMarker}>Main timer</span>
          <span className={cx(ui.pulseDot, isWorkoutRunning && ui.pulseDotRunning)} />
        </div>
        <div className={ui.bigTime}>{formatDuration(workoutElapsed)}</div>
        <p className={ui.timerSummaryMarked}>{workoutSummary}</p>
      </div>

      <div className={ui.timerActionGrid}>
        {!isWorkoutRunning ? (
          <Button variant="primary" onClick={onStartWorkout}>
            {workoutStatus === "paused" ? "Resume workout" : "Start workout"}
          </Button>
        ) : (
          <Button onClick={onPauseWorkout}>Pause workout</Button>
        )}

        <Button variant="soft" onClick={onResetWorkout} disabled={!hasActiveSession}>
          Reset session
        </Button>

        <Button variant="danger" onClick={onFinishWorkout} disabled={!hasActiveSession}>
          Finish + log session
        </Button>
      </div>
    </div>
  );
}
