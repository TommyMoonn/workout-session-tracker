import { cx } from "../../../lib/cx";
import { ui } from "../../../styles";

export function HistoryViewToggle({ value, onChange }) {
  return (
    <div className={ui.viewToggle} aria-label="History display mode">
      <ToggleButton
        active={value === "list"}
        icon={<ListIcon />}
        label="List view"
        onClick={() => onChange("list")}
      />
      <ToggleButton
        active={value === "card"}
        icon={<CardIcon />}
        label="Card view"
        onClick={() => onChange("card")}
      />
    </div>
  );
}

function ToggleButton({ active, icon, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={cx(ui.viewToggleButton, active && ui.viewToggleButtonActive)}
    >
      {icon}
    </button>
  );
}

function ListIcon() {
  return (
    <span className={ui.viewIconList} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function CardIcon() {
  return (
    <span className={ui.viewIconGrid} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
