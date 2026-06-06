import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ExerciseLibraryPage from "./pages/ExerciseLibraryPage";
import WorkoutSessionPage from "./pages/WorkoutSessionPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/timer" replace />} />
        <Route path="/timer" element={<WorkoutSessionPage />} />
        <Route path="/exercises" element={<ExerciseLibraryPage />} />
        <Route path="/libraries" element={<Navigate to="/exercises" replace />} />
        <Route path="*" element={<Navigate to="/timer" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
