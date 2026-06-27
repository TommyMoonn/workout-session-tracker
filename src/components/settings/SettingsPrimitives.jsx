import { cx } from "../../lib/cx";
import { ui } from "../../styles";

export function SettingsTab({ children }) {
  return <div className={ui.settingsTab}>{children}</div>;
}

export function SettingsSection({ children, title }) {
  return (
    <section className={ui.settingsSection}>
      <h3 className={ui.settingsSectionTitle}>{title}</h3>
      <div className={ui.settingsRows}>{children}</div>
    </section>
  );
}

export function SettingsRow({ children, label }) {
  return (
    <div className={ui.settingsRow}>
      <span className={ui.settingsRowLabel}>{label}</span>
      {children}
    </div>
  );
}

export function SettingsToggle({
  disabled = false,
  isActive,
  label,
  offLabel = "Off",
  onChange,
  onLabel = "On",
}) {
  return (
    <div className={ui.settingsToggle} role="group" aria-label={label}>
      <button
        type="button"
        className={cx(ui.settingsToggleButton, isActive && ui.settingsToggleButtonActive)}
        aria-pressed={isActive}
        disabled={disabled}
        onClick={() => onChange(true)}
      >
        {onLabel}
      </button>
      <button
        type="button"
        className={cx(ui.settingsToggleButton, !isActive && ui.settingsToggleButtonActive)}
        aria-pressed={!isActive}
        disabled={disabled}
        onClick={() => onChange(false)}
      >
        {offLabel}
      </button>
    </div>
  );
}

export function SettingsSegmentedControl({ label, onChange, options, value }) {
  return (
    <div className={ui.settingsSegmentedControl} role="group" aria-label={label}>
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            className={cx(
              ui.settingsSegmentedButton,
              isActive && ui.settingsSegmentedButtonActive,
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function SettingsActions({ children }) {
  return <div className={ui.settingsActions}>{children}</div>;
}

export function SettingsStatus({ children }) {
  return (
    <div className={ui.settingsStatus} aria-live="polite">
      {children}
    </div>
  );
}
