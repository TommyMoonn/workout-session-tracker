import { Navigate, Route, Routes } from "react-router-dom";
import ExerciseLibraryPage from "../pages/ExerciseLibraryPage";
import HistoryPage from "../pages/HistoryPage";
import TimerPage from "../pages/TimerPage";
import AppShell from "./layout/AppShell";

export function AppRoutes() {
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
