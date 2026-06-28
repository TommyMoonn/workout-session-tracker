import { AppearanceSettingsProvider } from "@features/appearanceSettings";
import { ShortcutProvider } from "@features/shortcuts";
import { SoundSettingsProvider } from "@features/soundSettings";
import { TimerSettingsProvider } from "@features/timerSettings";

export function AppProviders({ children }) {
  return (
    <AppearanceSettingsProvider>
      <TimerSettingsProvider>
        <SoundSettingsProvider>
          <ShortcutProvider>
            {children}
          </ShortcutProvider>
        </SoundSettingsProvider>
      </TimerSettingsProvider>
    </AppearanceSettingsProvider>
  );
}
