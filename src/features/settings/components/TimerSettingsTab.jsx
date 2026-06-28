import { Button } from "@shared/ui";
import { normalizeTimerRestSeconds, useTimerSettings } from "../timer";
import { ui } from "@shared/styles";
import {
  SettingsActions,
  SettingsRow,
  SettingsSection,
  SettingsTab,
  SettingsToggle,
} from "./SettingsPrimitives";

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
    <SettingsTab>
      <SettingsSection title="Timer behavior">
        <SettingsRow label="Default rest duration">
          <div className={ui.settingsNumberControl}>
            <input
              key={settings.defaultRestSeconds}
              aria-label="Default rest duration seconds"
              className={ui.input}
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
            <span className={ui.settingsUnit}>Sec</span>
          </div>
        </SettingsRow>

        <SettingsRow label="Auto-start rest after set">
          <SettingsToggle
            label="Auto-start rest after set"
            isActive={settings.autoStartRestAfterSet}
            onChange={setAutoStartRestAfterSet}
          />
        </SettingsRow>

        <SettingsRow label="Confirm reset session">
          <SettingsToggle
            label="Confirm reset session"
            isActive={settings.confirmResetSession}
            onChange={setConfirmResetSession}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsActions>
        <Button type="button" variant="soft" className={ui.settingsActionButton} onClick={resetTimerSettings}>
          Reset timer
        </Button>
      </SettingsActions>
    </SettingsTab>
  );
}
