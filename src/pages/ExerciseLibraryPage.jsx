import { ExerciseLibrary } from "../features/exercises/components/ExerciseLibrary";
import { useExerciseLibrary } from "../features/exercises/hooks/useExerciseLibrary";

function ExerciseLibraryPage() {
  const exerciseLibrary = useExerciseLibrary();
  return <ExerciseLibrary {...exerciseLibrary} />;
}

export default ExerciseLibraryPage;
