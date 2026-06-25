import { Button } from "../../../components/ui";
import { SetTable } from "../../../components/session";
import { ui } from "../../../styles";

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
            <div className={ui.tableScroll}>
              <SetTable sets={setLogs} emptyText="No sets logged in the current session yet." onDeleteSet={onDeleteSet} />
            </div>
          </div>
        </div>
        <div className={ui.drawerFooter}>
          <Button variant="soft" onClick={onClear} disabled={setLogs.length === 0}>Clear current sets</Button>
        </div>
      </aside>
    </>
  );
}
