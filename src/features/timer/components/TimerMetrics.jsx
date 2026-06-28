import { Button } from "@shared/ui";
import { cx } from "@shared/lib/cx";
import { ui } from "@shared/styles";
import { formatDuration } from "@domain/workout";

export function TimerMetrics({ onClearSetLogs, onOpenSetLog, setCount, totalRestSeconds, workoutElapsed, className = "" }) {
  return (
    <section className={cx(ui.metricGrid, className)}>
      <MetricCard label="Workout time" value={formatDuration(workoutElapsed)} />
      <MetricCard label="Total rest time" value={formatDuration(totalRestSeconds)} />
      <MetricCard label="Sets logged" value={String(setCount)}>
        <div className={ui.metricActions}>
          <Button variant="primary" onClick={onOpenSetLog}>Open log</Button>
          <Button variant="soft" onClick={onClearSetLogs} disabled={setCount === 0}>Clear</Button>
        </div>
      </MetricCard>
    </section>
  );
}

function MetricCard({ label, value, children }) {
  return (
    <div className={ui.metricCard}>
      <div>
        <p className={ui.labelMarker}>{label}</p>
        <p className={ui.metricValue}>{value}</p>
      </div>
      {children}
    </div>
  );
}
