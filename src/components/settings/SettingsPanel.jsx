import { useState } from "react";
import { Button, MarkerLabel } from "../ui";
import { cx } from "../../lib/cx";
import { ui } from "../../styles";
import { ShortcutSettingsTab } from "./ShortcutSettingsTab";
import { SoundSettingsTab } from "./SoundSettingsTab";

const settingsTabs = [
  { id: "shortcuts", label: "Shortcuts" },
  { id: "sound", label: "Sound" },
];

export function SettingsPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState("shortcuts");

  return (
    <div className={ui.modalOverlay} role="presentation" onMouseDown={onClose}>
      <section
        className="flex h-[min(820px,calc(100vh-40px))] w-[min(760px,100%)] flex-col overflow-hidden border border-[var(--oc-hairline-strong)] bg-[var(--oc-canvas)] text-[var(--oc-ink)] motion-safe:animate-[modalIn_var(--transition-base)_both]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        data-shortcut-blocking="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="relative border-b border-[var(--oc-hairline)] p-4 pr-16">
          <MarkerLabel as="p">Settings</MarkerLabel>
          <h2 id="settings-title" className={ui.sectionTitle}>Settings</h2>
          <Button
            type="button"
            variant="soft"
            className="absolute right-4 top-4 h-10 w-10 p-0 text-base leading-none"
            aria-label="Close settings"
            onClick={onClose}
          >
            ×
          </Button>
        </header>

        <nav className="grid grid-cols-2 border-b border-[var(--oc-hairline)]" aria-label="Settings sections">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cx(
                "min-h-10 border-r border-[var(--oc-hairline)] px-3 py-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--oc-muted)] last:border-r-0 hover:bg-[var(--oc-surface-soft)] hover:text-[var(--oc-ink)]",
                activeTab === tab.id && "bg-[var(--oc-primary-soft)] text-[var(--oc-ink)]"
              )}
              aria-current={activeTab === tab.id ? "page" : undefined}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {activeTab === "shortcuts" ? <ShortcutSettingsTab /> : <SoundSettingsTab />}
        </div>
      </section>
    </div>
  );
}
