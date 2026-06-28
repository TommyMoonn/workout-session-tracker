import { Button } from "@shared/ui";
import { cx } from "@shared/lib/cx";
import { ui } from "@shared/styles";

export function ArchiveActions({
  hasSelectedSession,
  hasSessions,
  jsonInputRef,
  onClear,
  onExportAllMarkdown,
  onExportJson,
  onExportSelectedMarkdown,
  onImportJson,
  onOpenImport,
}) {
  return (
    <div className={ui.actionGroups}>
      <input ref={jsonInputRef} type="file" accept="application/json,.json" hidden onChange={onImportJson} />
      <ActionGroup label="Backup JSON">
        <ActionButton label="Export" onClick={onExportJson} disabled={!hasSessions} />
        <ActionButton label="Load" onClick={onOpenImport} />
      </ActionGroup>
      <ActionGroup label="Markdown report">
        <ActionButton label="Selected" onClick={onExportSelectedMarkdown} disabled={!hasSelectedSession} primary />
        <ActionButton label="All" onClick={onExportAllMarkdown} disabled={!hasSessions} />
      </ActionGroup>
      <ActionGroup label="Manage" compact danger>
        <ActionButton label="Clear" onClick={onClear} disabled={!hasSessions} danger />
      </ActionGroup>
    </div>
  );
}

function ActionGroup({ label, children, compact = false, danger = false }) {
  return (
    <div className={cx(
      ui.actionGroup,
      compact && ui.actionGroupCompact,
      danger && ui.actionGroupDanger,
    )}>
      <p className={cx(ui.labelMarker, "whitespace-nowrap")}>{label}</p>
      <div className={ui.actionButtons}>{children}</div>
    </div>
  );
}

function ActionButton({ label, onClick, disabled = false, primary = false, danger = false }) {
  return (
    <Button
      variant={primary ? "primary" : danger ? "danger" : "default"}
      className="min-h-9 px-3 py-0 text-xs"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
