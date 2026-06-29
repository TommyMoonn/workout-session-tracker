import { Navigate, Route, Routes } from "react-router-dom";
import CalendarPage from "../pages/CalendarPage";
import ExerciseLibraryPage from "../pages/ExerciseLibraryPage";
import HistoryPage from "../pages/HistoryPage";
import TimerPage from "../pages/TimerPage";
import AppShell from "./layout/AppShell";
import { RouteContent } from "./layout/RouteContent";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/timer" replace />} />
        <Route path="/timer" element={<RouteContent key="timer"><TimerPage /></RouteContent>} />
        <Route path="/history" element={<RouteContent key="history"><HistoryPage /></RouteContent>} />
        <Route path="/exercises" element={<RouteContent key="exercises"><ExerciseLibraryPage /></RouteContent>} />
        <Route path="/calendar" element={<RouteContent key="calendar"><CalendarPage /></RouteContent>} />
        <Route path="/libraries" element={<Navigate to="/exercises" replace />} />
        <Route path="*" element={<Navigate to="/timer" replace />} />
      </Route>
    </Routes>
  );
}
