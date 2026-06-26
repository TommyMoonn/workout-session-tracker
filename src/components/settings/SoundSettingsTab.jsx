import { Button, SelectField } from "../ui";
import { restAlertVolumeOptions, useSoundSettings } from "../../features/soundSettings";

export function SoundSettingsTab() {
  const {
    playPreview,
    resetSoundSettings,
    setRestAlertRepeatEnabled,
    setRestAlertSoundEnabled,
    setRestAlertVolume,
    settings,
  } = useSoundSettings();

  return (
    <div className="grid gap-3">
      <section className="border border-[var(--oc-hairline)] bg-[var(--oc-surface)]">
        <h3 className="border-b border-[var(--oc-hairline)] px-3 py-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--oc-muted)]">
          Rest alert
        </h3>

        <div className="divide-y divide-[var(--oc-hairline)]">
          <SettingRow label="Sound">
            <ToggleButton
              isActive={settings.restAlertSoundEnabled}
              onChange={setRestAlertSoundEnabled}
              onLabel="On"
              offLabel="Off"
            />
          </SettingRow>

          <SettingRow label="Repeat until dismissed">
            <ToggleButton
              isActive={settings.restAlertRepeatEnabled}
              onChange={setRestAlertRepeatEnabled}
              onLabel="On"
              offLabel="Off"
              disabled={!settings.restAlertSoundEnabled}
            />
          </SettingRow>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(180px,220px)] items-center gap-3 px-3 py-2 text-sm max-[620px]:grid-cols-1 max-[520px]:py-3">
            <span className="text-[var(--oc-body)]">Volume</span>
            <SelectField
              label="Volume"
              value={settings.restAlertVolume}
              options={restAlertVolumeOptions}
              onChange={setRestAlertVolume}
              hideLabel
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap justify-end gap-2 border border-[var(--oc-hairline)] bg-[var(--oc-surface)] px-3 py-2 max-[520px]:grid max-[520px]:grid-cols-2">
        <Button type="button" variant="soft" className="min-h-8 px-3 py-1 text-xs" onClick={playPreview} disabled={!settings.restAlertSoundEnabled}>
          Test sound
        </Button>
        <Button type="button" variant="soft" className="min-h-8 px-3 py-1 text-xs" onClick={resetSoundSettings}>
          Reset sound
        </Button>
      </div>
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2 text-sm max-[620px]:grid-cols-1 max-[520px]:py-3">
      <span className="text-[var(--oc-body)]">{label}</span>
      {children}
    </div>
  );
}

function ToggleButton({ disabled = false, isActive, offLabel, onChange, onLabel }) {
  return (
    <div className="inline-grid grid-cols-2 rounded-[4px] border border-[var(--oc-hairline-strong)] bg-[var(--oc-canvas-deep)] p-1 text-xs max-[520px]:w-full">
      <button
        type="button"
        className={toggleButtonClass(isActive)}
        aria-pressed={isActive}
        disabled={disabled}
        onClick={() => onChange(true)}
      >
        {onLabel}
      </button>
      <button
        type="button"
        className={toggleButtonClass(!isActive)}
        aria-pressed={!isActive}
        disabled={disabled}
        onClick={() => onChange(false)}
      >
        {offLabel}
      </button>
    </div>
  );
}

function toggleButtonClass(isActive) {
  return [
    "min-h-8 min-w-14 rounded-[4px] px-3 font-bold uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
    isActive
      ? "border border-[var(--oc-hairline-strong)] bg-[var(--oc-primary-soft)] text-[var(--oc-ink)]"
      : "border border-transparent text-[var(--oc-muted)] hover:text-[var(--oc-ink)]",
  ].join(" ");
}
