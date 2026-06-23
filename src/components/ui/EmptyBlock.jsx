import { cx } from "../../lib/cx";
import { ui } from "../../styles";

export function EmptyBlock({ children, className = "" }) {
  return (
    <div className={cx(ui.emptyState, className)}>
      <span className={ui.marker}>[-]</span> {children}
    </div>
  );
}

export function EmptyState({ text }) {
  return <div className={ui.emptyMarked}>{text}</div>;
}
