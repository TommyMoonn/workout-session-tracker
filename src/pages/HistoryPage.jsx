import { HistoryArchive } from "../features/history/components/HistoryArchive";
import { useSessionHistory } from "../features/history/hooks/useSessionHistory";

function HistoryPage() {
  const history = useSessionHistory();
  return <HistoryArchive {...history} />;
}

export default HistoryPage;
