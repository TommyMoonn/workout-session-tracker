import {
  AppearanceSettingsProvider,
  ShortcutProvider,
  SoundSettingsProvider,
  TimerSettingsProvider,
} from "@features/settings";

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
