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
    <div className={ui.modalOverlay} role="presentation" onMouseDown={onClose}>
      <section
        className="flex h-[min(820px,calc(100vh-40px))] w-[min(760px,100%)] flex-col overflow-hidden border border-[var(--oc-hairline-strong)] bg-[var(--oc-canvas)] text-[var(--oc-ink)] motion-safe:animate-[modalIn_var(--transition-base)_both] max-[760px]:h-[100dvh] max-[760px]:w-full max-[760px]:border-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        data-shortcut-blocking="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="relative border-b border-[var(--oc-hairline)] p-4 pr-16 max-[520px]:p-3 max-[520px]:pr-14">
          <MarkerLabel as="p">Settings</MarkerLabel>
          <h2 id="settings-title" className={ui.sectionTitle}>Settings</h2>
          <Button
            type="button"
            variant="soft"
            className="absolute right-4 top-4 h-10 w-10 p-0 text-base leading-none max-[520px]:right-3 max-[520px]:top-3 max-[520px]:w-10"
            aria-label="Close settings"
            onClick={onClose}
          >
            ×
          </Button>
        </header>

        <nav className="grid grid-cols-3 border-b border-[var(--oc-hairline)]" aria-label="Settings sections">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cx(
                "min-h-10 border-r border-[var(--oc-hairline)] px-3 py-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--oc-muted)] last:border-r-0 hover:bg-[var(--oc-surface-soft)] hover:text-[var(--oc-ink)] max-[520px]:min-h-11 max-[520px]:px-1.5 max-[520px]:text-[11px] max-[520px]:tracking-[0.06em]",
                activeTab === tab.id && "bg-[var(--oc-primary-soft)] text-[var(--oc-ink)]"
              )}
              aria-current={activeTab === tab.id ? "page" : undefined}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 max-[520px]:p-3">
          {activeTab === "timer" && <TimerSettingsTab />}
          {activeTab === "shortcuts" && <ShortcutSettingsTab />}
          {activeTab === "sound" && <SoundSettingsTab />}
        </div>
      </section>
    </div>
  );
}
