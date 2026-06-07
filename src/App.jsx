import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import ExerciseLibraryPage from "./pages/ExerciseLibraryPage";
import HistoryPage from "./pages/HistoryPage";
import TimerPage from "./pages/TimerPage";

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/timer" replace />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/exercises" element={<ExerciseLibraryPage />} />
        <Route path="/libraries" element={<Navigate to="/exercises" replace />} />
        <Route path="*" element={<Navigate to="/timer" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
