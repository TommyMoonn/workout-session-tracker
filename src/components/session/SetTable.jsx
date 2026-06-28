import { Button } from "@shared/ui";
import { ui } from "@shared/styles";
import { formatClock } from "../../utils/workoutFormat";

export function SetTable({ sets, emptyText, onDeleteSet }) {
  return (
    <table className={ui.table}>
      <thead>
        <tr>
          <th className={ui.tableSetCell}>Set</th>
          <th>Duration</th>
          <th>Completed</th>
          <th>Rest goal</th>
          <th>Rest actual</th>
          <th>Rest start</th>
          <th>Rest end</th>
          <th className={ui.tableActionHeader}>Action</th>
        </tr>
      </thead>
      <tbody>
        {sets.length === 0 ? (
          <tr>
            <td className={ui.emptyTableCell} colSpan={8}>{emptyText}</td>
          </tr>
        ) : (
          sets.map((set) => (
            <tr key={set.id}>
              <td className={ui.tableSetCell}>Set {set.setNumber}</td>
              <td className={ui.tableTimeCell}>{formatClock(set.timeToCompleteSetSeconds ?? 0)}</td>
              <td className={ui.tableTimeCell}>{formatClock(set.completedAtSessionSeconds ?? 0)}</td>
              <td className={ui.tableTimeCell}>{formatClock(set.restTargetSeconds ?? 0)}</td>
              <td className={ui.tableTimeCell}>{set.restActualSeconds == null ? "—" : formatClock(set.restActualSeconds)}</td>
              <td className={ui.tableTimeCell}>{set.restStartedAtSessionSeconds == null ? "—" : formatClock(set.restStartedAtSessionSeconds)}</td>
              <td className={ui.tableTimeCell}>{set.restEndedAtSessionSeconds == null ? "—" : formatClock(set.restEndedAtSessionSeconds)}</td>
              <td className={ui.tableActionCell}>
                <Button variant="danger" className={ui.tableActionButton} onClick={() => onDeleteSet(set.id)}>Delete</Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
