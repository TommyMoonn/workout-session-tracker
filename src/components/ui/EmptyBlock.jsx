import { cx } from "../../lib/cx";
import { ui } from "../../styles";

export function EmptyBlock({ action = null, children, className = "" }) {
  return (
    <div className={cx(ui.emptyState, className)}>
      <span className={ui.marker}>[-]</span>
      <span className={ui.emptyStateText}>{children}</span>
      {action && <span className={ui.emptyStateAction}>{action}</span>}
    </div>
  );
}

export function EmptyState({ text }) {
  return <EmptyBlock>{text}</EmptyBlock>;
}
