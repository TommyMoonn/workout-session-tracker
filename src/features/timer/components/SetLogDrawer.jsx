import { Button } from "@shared/ui";
import { SetTable } from "@domain/workout";
import { timerUi as ui } from "../styles";

export function SetLogDrawer({ setLogs, onClose, onClear, onDeleteSet }) {
  return (
    <>
      <div className={ui.overlay} onMouseDown={onClose} />
      <aside className={ui.drawerPanel} onMouseDown={(event) => event.stopPropagation()}>
        <div className={ui.drawerHeader}>
          <div>
            <p className={ui.labelMarker}>Current set log</p>
            <h2 className={ui.sectionTitle}>{setLogs.length} sets logged</h2>
          </div>
          <Button variant="soft" className={ui.drawerClose} onClick={onClose} aria-label="Close set log">×</Button>
        </div>
        <div className={ui.drawerBody}>
          <div className={ui.tablePanel}>
            <div className={ui.tableTitleMarked}>Current session sets</div>
            <div
              aria-label="Current session set details"
              className={ui.tableScroll}
              role="region"
              tabIndex={0}
            >
              <SetTable sets={setLogs} emptyText="No sets logged in the current session yet." onDeleteSet={onDeleteSet} />
            </div>
          </div>
        </div>
        <div className={ui.drawerFooter}>
          <p className="text-xs font-bold uppercase leading-normal text-[var(--oc-muted)]">
            {setLogs.length === 0 ? "No active sets" : `${setLogs.length} set${setLogs.length === 1 ? "" : "s"} in current session`}
          </p>
          <Button variant="soft" onClick={onClear} disabled={setLogs.length === 0}>Clear current sets</Button>
        </div>
      </aside>
    </>
  );
}
