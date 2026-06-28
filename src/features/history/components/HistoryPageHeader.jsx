import { historyUi as ui } from "../styles";

export function HistoryPageHeader({ sessionCount }) {
  return (
    <section className={ui.pageHeader}>
      <div>
        <p className={ui.labelMarker}>History</p>
        <h1 className={ui.pageTitle}>Finished sessions</h1>
      </div>
      <div className={ui.countCard}>
        <span className={ui.countLabel}>Total</span>
        <strong className={ui.countValue}>{sessionCount}</strong>
      </div>
    </section>
  );
}
