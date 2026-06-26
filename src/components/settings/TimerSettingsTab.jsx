import { Button } from "../ui";
import { normalizeTimerRestSeconds, useTimerSettings } from "../../features/timerSettings";

export function TimerSettingsTab() {
  const {
    resetTimerSettings,
    setAutoStartRestAfterSet,
    setConfirmResetSession,
    setDefaultRestSeconds,
    settings,
  } = useTimerSettings();

  function commitDefaultRestSeconds(event) {
    const nextSeconds = normalizeTimerRestSeconds(event.currentTarget.value);
    setDefaultRestSeconds(nextSeconds);
    event.currentTarget.value = String(nextSeconds);
  }

  return (
    <div className="grid gap-3">
      <section className="border border-[var(--oc-hairline)] bg-[var(--oc-surface)]">
        <h3 className="border-b border-[var(--oc-hairline)] px-3 py-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--oc-muted)]">
          Timer behavior
        </h3>

        <div className="divide-y divide-[var(--oc-hairline)]">
          <SettingRow label="Default rest duration">
            <div className="grid grid-cols-[minmax(0,140px)_56px] gap-2 max-[520px]:grid-cols-[minmax(0,1fr)_56px]">
              <input
                key={settings.defaultRestSeconds}
                aria-label="Default rest duration seconds"
                className="min-h-9 rounded-[4px] border border-[var(--oc-hairline-strong)] bg-[var(--oc-canvas-deep)] px-3 text-sm font-medium text-[var(--oc-ink)] outline-none focus:border-[var(--oc-accent)]"
                type="number"
                min="1"
                max="1800"
                step="1"
                inputMode="numeric"
                defaultValue={settings.defaultRestSeconds}
                onBlur={commitDefaultRestSeconds}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                }}
              />
              <span className="grid min-h-9 place-items-center rounded-[4px] border border-[var(--oc-hairline)] bg-[var(--oc-surface-soft)] text-xs font-bold uppercase text-[var(--oc-muted)]">
                Sec
              </span>
            </div>
          </SettingRow>

          <SettingRow label="Auto-start rest after set">
            <ToggleButton
              isActive={settings.autoStartRestAfterSet}
              onChange={setAutoStartRestAfterSet}
              onLabel="On"
              offLabel="Off"
            />
          </SettingRow>

          <SettingRow label="Confirm reset session">
            <ToggleButton
              isActive={settings.confirmResetSession}
              onChange={setConfirmResetSession}
              onLabel="On"
              offLabel="Off"
            />
          </SettingRow>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-2 border border-[var(--oc-hairline)] bg-[var(--oc-surface)] px-3 py-2 max-[520px]:grid max-[520px]:grid-cols-1">
        <Button type="button" variant="soft" className="min-h-8 px-3 py-1 text-xs" onClick={resetTimerSettings}>
          Reset timer
        </Button>
      </div>
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2 text-sm max-[620px]:grid-cols-1 max-[520px]:px-3 max-[520px]:py-3">
      <span className="text-[var(--oc-body)]">{label}</span>
      {children}
    </div>
  );
}

function ToggleButton({ isActive, offLabel, onChange, onLabel }) {
  return (
    <div className="inline-grid grid-cols-2 rounded-[4px] border border-[var(--oc-hairline-strong)] bg-[var(--oc-canvas-deep)] p-1 text-xs max-[520px]:w-full">
      <button
        type="button"
        className={toggleButtonClass(isActive)}
        aria-pressed={isActive}
        onClick={() => onChange(true)}
      >
        {onLabel}
      </button>
      <button
        type="button"
        className={toggleButtonClass(!isActive)}
        aria-pressed={!isActive}
        onClick={() => onChange(false)}
      >
        {offLabel}
      </button>
    </div>
  );
}

function toggleButtonClass(isActive) {
  return [
    "min-h-8 min-w-14 rounded-[4px] px-3 font-bold uppercase tracking-[0.12em] transition-colors",
    isActive
      ? "border border-[var(--oc-hairline-strong)] bg-[var(--oc-primary-soft)] text-[var(--oc-ink)]"
      : "border border-transparent text-[var(--oc-muted)] hover:text-[var(--oc-ink)]",
  ].join(" ");
}
