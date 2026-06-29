import { useState } from "react";
import { Button, MarkerLabel } from "@shared/ui";
import { cx } from "@shared/lib";
import { settingsUi as ui } from "../styles";
import { AppearanceSettingsTab } from "./AppearanceSettingsTab";
import { ShortcutSettingsTab } from "./ShortcutSettingsTab";
import { SoundSettingsTab } from "./SoundSettingsTab";
import { TimerSettingsTab } from "./TimerSettingsTab";

const settingsTabs = [
  { id: "timer", label: "Timer", Component: TimerSettingsTab },
  { id: "shortcuts", label: "Shortcuts", Component: ShortcutSettingsTab },
  { id: "sound", label: "Sound", Component: SoundSettingsTab },
  { id: "appearance", label: "Appearance", Component: AppearanceSettingsTab },
];

export function SettingsPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState("timer");
  const activeTabDefinition = settingsTabs.find((tab) => tab.id === activeTab) ?? settingsTabs[0];
  const ActiveTab = activeTabDefinition.Component;

  return (
    <div className={cx(ui.modalOverlay, ui.settingsOverlay)} role="presentation" onMouseDown={onClose}>
      <section
        className={ui.settingsModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        data-shortcut-blocking="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={ui.settingsHeader}>
          <MarkerLabel as="p">Settings</MarkerLabel>
          <h2 id="settings-title" className={ui.sectionTitle}>Settings</h2>
          <Button
            type="button"
            variant="soft"
            className={ui.settingsCloseButton}
            aria-label="Close settings"
            onClick={onClose}
          >
            ×
          </Button>
        </header>

        <nav className={ui.settingsTabs} aria-label="Settings sections" role="tablist">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              id={`settings-tab-${tab.id}`}
              type="button"
              role="tab"
              className={cx(
                ui.settingsTabButton,
                activeTab === tab.id && ui.settingsTabButtonActive
              )}
              aria-controls={`settings-panel-${tab.id}`}
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={ui.settingsContent}>
          <div
            key={activeTab}
            id={`settings-panel-${activeTab}`}
            aria-labelledby={`settings-tab-${activeTab}`}
            className={ui.settingsTabTransition}
            role="tabpanel"
          >
            <ActiveTab />
          </div>
        </div>
      </section>
    </div>
  );
}
