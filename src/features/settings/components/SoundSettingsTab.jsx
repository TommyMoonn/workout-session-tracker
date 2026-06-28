import { Button, SelectField } from "@shared/ui";
import { restAlertVolumeOptions, useSoundSettings } from "../sound";
import { settingsUi as ui } from "../styles";
import {
  SettingsActions,
  SettingsRow,
  SettingsSection,
  SettingsTab,
  SettingsToggle,
} from "./SettingsPrimitives";

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
    <SettingsTab>
      <SettingsSection title="Rest alert">
        <SettingsRow label="Sound">
          <SettingsToggle
            label="Sound"
            isActive={settings.restAlertSoundEnabled}
            onChange={setRestAlertSoundEnabled}
          />
        </SettingsRow>

        <SettingsRow label="Repeat until dismissed">
          <SettingsToggle
            label="Repeat until dismissed"
            isActive={settings.restAlertRepeatEnabled}
            onChange={setRestAlertRepeatEnabled}
            disabled={!settings.restAlertSoundEnabled}
          />
        </SettingsRow>

        <SettingsRow label="Volume">
          <SelectField
            label="Volume"
            value={settings.restAlertVolume}
            options={restAlertVolumeOptions}
            onChange={setRestAlertVolume}
            hideLabel
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsActions>
        <Button type="button" variant="soft" className={ui.settingsActionButton} onClick={playPreview} disabled={!settings.restAlertSoundEnabled}>
          Test sound
        </Button>
        <Button type="button" variant="soft" className={ui.settingsActionButton} onClick={resetSoundSettings}>
          Reset sound
        </Button>
      </SettingsActions>
    </SettingsTab>
  );
}
