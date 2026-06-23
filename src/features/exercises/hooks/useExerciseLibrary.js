import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  allOption,
  filterExercises,
  getExerciseOptions,
  searchableExercises,
} from "../utils/exerciseSearch";

const exerciseOptions = getExerciseOptions();

export function useExerciseLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allOption);
  const [equipment, setEquipment] = useState(allOption);
  const [difficulty, setDifficulty] = useState(allOption);
  const [demoFilter, setDemoFilter] = useState(allOption);
  const [selectedExerciseId, setSelectedExerciseId] = useState(searchableExercises[0]?.id ?? null);
  const deferredQuery = useDeferredValue(query);

  const filteredExercises = useMemo(() => filterExercises(searchableExercises, {
    query: deferredQuery,
    category,
    equipment,
    difficulty,
    demoFilter,
  }), [deferredQuery, category, equipment, difficulty, demoFilter]);

  const selectedExercise = useMemo(() => (
    filteredExercises.find((exercise) => exercise.id === selectedExerciseId)
    ?? filteredExercises[0]
    ?? null
  ), [filteredExercises, selectedExerciseId]);

  useEffect(() => {
    if (!filteredExercises.length) return;
    if (!filteredExercises.some((exercise) => exercise.id === selectedExerciseId)) {
      setSelectedExerciseId(filteredExercises[0].id);
    }
  }, [filteredExercises, selectedExerciseId]);

  const activeFilterCount = [category, equipment, difficulty, demoFilter].filter((value) => value !== allOption).length
    + (query.trim() ? 1 : 0);

  function clearFilters() {
    setQuery("");
    setCategory(allOption);
    setEquipment(allOption);
    setDifficulty(allOption);
    setDemoFilter(allOption);
  }

  return {
    state: {
      activeFilterCount,
      category,
      demoFilter,
      difficulty,
      equipment,
      filteredExercises,
      query,
      selectedExercise,
      totalExerciseCount: searchableExercises.length,
      ...exerciseOptions,
    },
    actions: {
      clearFilters,
      setCategory,
      setDemoFilter,
      setDifficulty,
      setEquipment,
      setQuery,
      setSelectedExerciseId,
    },
  };
}
