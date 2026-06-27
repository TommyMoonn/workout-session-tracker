import { useState } from "react";
import { Button, MarkerLabel } from "../ui";
import { cx } from "../../lib/cx";
import { ui } from "../../styles";
import { ShortcutSettingsTab } from "./ShortcutSettingsTab";
import { SoundSettingsTab } from "./SoundSettingsTab";
import { TimerSettingsTab } from "./TimerSettingsTab";

const settingsTabs = [
  { id: "timer", label: "Timer" },
  { id: "shortcuts", label: "Shortcuts" },
  { id: "sound", label: "Sound" },
];

export function SettingsPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState("timer");

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

        <nav className={ui.settingsTabs} aria-label="Settings sections">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cx(
                ui.settingsTabButton,
                activeTab === tab.id && ui.settingsTabButtonActive
              )}
              aria-current={activeTab === tab.id ? "page" : undefined}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={ui.settingsContent}>
          {activeTab === "timer" && <TimerSettingsTab />}
          {activeTab === "shortcuts" && <ShortcutSettingsTab />}
          {activeTab === "sound" && <SoundSettingsTab />}
        </div>
      </section>
    </div>
  );
}
