import { Button } from "../ui";
import { ui } from "../../styles";
import { formatClock } from "../../utils/workoutFormat";

export function SetTable({ sets, emptyText, onDeleteSet }) {
  return (
    <table className={ui.table}>
      <thead>
        <tr>
          <th>Set</th>
          <th>Time to complete</th>
          <th>Completed at</th>
          <th>Rest target</th>
          <th>Rest actual</th>
          <th>Rest start</th>
          <th>Rest end</th>
          <th>Action</th>
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
              <td>Set {set.setNumber}</td>
              <td>{formatClock(set.timeToCompleteSetSeconds ?? 0)}</td>
              <td>{formatClock(set.completedAtSessionSeconds ?? 0)}</td>
              <td>{formatClock(set.restTargetSeconds ?? 0)}</td>
              <td>{set.restActualSeconds == null ? "—" : formatClock(set.restActualSeconds)}</td>
              <td>{formatClock(set.restStartedAtSessionSeconds ?? 0)}</td>
              <td>{set.restEndedAtSessionSeconds == null ? "—" : formatClock(set.restEndedAtSessionSeconds)}</td>
              <td>
                <Button variant="soft" onClick={() => onDeleteSet(set.id)}>Delete</Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
