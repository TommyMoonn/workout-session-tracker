import { HistoryArchive, useSessionHistory } from "@features/history";

function HistoryPage() {
  const history = useSessionHistory();
  return <HistoryArchive {...history} />;
}

export default HistoryPage;
