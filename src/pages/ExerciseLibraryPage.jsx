import { ExerciseLibrary, useExerciseLibrary } from "@features/exercises";

function ExerciseLibraryPage() {
  const exerciseLibrary = useExerciseLibrary();
  return <ExerciseLibrary {...exerciseLibrary} />;
}

export default ExerciseLibraryPage;
