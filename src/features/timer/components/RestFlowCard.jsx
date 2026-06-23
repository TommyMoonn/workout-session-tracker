import { Button } from "../../../components/ui";
import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";
import { formatClock } from "../../../utils/workoutFormat";
import { restPresets } from "../constants";

export function RestFlowCard({
  isRestRunning,
  onChangeRestDurationInput,
  onCommitRestDurationInput,
  onCompleteSetAndStartRest,
  onPauseRest,
  onResetRest,
  onResumeRest,
  onSelectRestPreset,
  restDuration,
  restDurationInput,
  restProgress,
  restRemaining,
  restStatus,
  activeSetId,
  className = "",
}) {
  return (
    <aside className={cx(ui.card, ui.cardPadding, ui.restCard, className)}>
      <div>
        <p className={ui.labelMarker}>Set + rest flow</p>
        <h2 className={ui.sectionTitle}>Complete set, then rest.</h2>
      </div>

      <div className={ui.restDisplay}>
        <div className={ui.rowBetween}>
          <div>
            <p className={ui.labelMarker}>Rest remaining</p>
            <p className={ui.restTime}>{formatClock(restRemaining)}</p>
          </div>
          <p className={ui.restStatus}>{restStatus === "idle" ? "Not running" : restStatus}</p>
        </div>
        <div className={ui.progressShell}>
          <div className={ui.progressFill} style={{ width: `${restProgress}%` }} />
        </div>
      </div>

      <div>
        <div className={ui.inputRow}>
          <input
            id="restSeconds"
            aria-label="Rest seconds"
            className={ui.input}
            type="number"
            min="1"
            max="1800"
            step="1"
            inputMode="numeric"
            value={restDurationInput}
            onChange={(event) => onChangeRestDurationInput(event.target.value)}
            onBlur={onCommitRestDurationInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
          />
          <span className={ui.unitBox}>Sec</span>
        </div>

        <div className={ui.presets}>
          {restPresets.map((seconds) => (
            <button
              key={seconds}
              type="button"
              onClick={() => onSelectRestPreset(seconds)}
              className={cx(ui.preset, restDuration === seconds && ui.presetActive)}
            >
              {seconds}s
            </button>
          ))}
        </div>
      </div>

      <div className={cx("mt-auto", ui.buttonGrid)}>
        <Button variant="primary" onClick={onCompleteSetAndStartRest}>Complete set + start rest</Button>
        <div className={ui.twoCol}>
          {!isRestRunning ? (
            <Button onClick={onResumeRest} disabled={restStatus !== "paused"}>Resume rest</Button>
          ) : (
            <Button onClick={onPauseRest}>Pause rest</Button>
          )}
          <Button variant="danger" onClick={onResetRest} disabled={!activeSetId}>Stop rest</Button>
        </div>
      </div>
    </aside>
  );
}
