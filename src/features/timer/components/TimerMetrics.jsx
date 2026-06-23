import { Button } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { formatDuration } from "../../../utils/workoutFormat";

export function TimerMetrics({ onClearSetLogs, onOpenSetLog, setCount, totalRestSeconds, workoutElapsed, className = "" }) {
  return (
    <section className={cx(ui.metricGrid, className)}>
      <MetricCard label="Workout time" value={formatDuration(workoutElapsed)} />
      <MetricCard label="Total rest time" value={formatDuration(totalRestSeconds)} />
      <MetricCard label="Sets logged" value={String(setCount)}>
        <div className="grid grid-cols-1 gap-2">
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
      <p className={ui.labelMarker}>{label}</p>
      <p className={ui.metricValue}>{value}</p>
      {children}
    </div>
  );
}
