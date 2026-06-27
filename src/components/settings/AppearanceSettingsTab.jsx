import { useAppearanceSettings } from "../../features/appearanceSettings";
import {
  SettingsRow,
  SettingsSection,
  SettingsSegmentedControl,
  SettingsTab,
} from "./SettingsPrimitives";

export function AppearanceSettingsTab() {
  const {
    appearance,
    appearanceOptions,
    setAppearance,
  } = useAppearanceSettings();

  return (
    <SettingsTab>
      <SettingsSection title="Appearance">
        <SettingsRow label="Color theme">
          <SettingsSegmentedControl
            label="Color theme"
            value={appearance}
            options={appearanceOptions}
            onChange={setAppearance}
          />
        </SettingsRow>
      </SettingsSection>
    </SettingsTab>
  );
}
