import { useEffect, useMemo, useState } from "react";
import exercises from "../data/exercises.json";

const allOption = "All";

function ExerciseLibraryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allOption);
  const [equipment, setEquipment] = useState(allOption);
  const [difficulty, setDifficulty] = useState(allOption);
  const [demoFilter, setDemoFilter] = useState(allOption);
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercises[0]?.id ?? null);

  const categories = useMemo(() => getUniqueValues(exercises.map((item) => item.category)), []);
  const equipmentOptions = useMemo(() => getUniqueValues(exercises.map((item) => normalizeEquipment(item.equipment))), []);
  const difficultyOptions = useMemo(() => getUniqueValues(exercises.map((item) => item.difficulty)), []);

  const filteredExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const normalizedEquipment = normalizeEquipment(exercise.equipment);
      const searchableText = [
        exercise.name,
        exercise.category,
        normalizedEquipment,
        exercise.difficulty,
        exercise.movementType,
        exercise.description,
        ...(exercise.primaryMuscles ?? []),
      ].join(" ").toLowerCase();

      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesCategory = category === allOption || exercise.category === category;
      const matchesEquipment = equipment === allOption || normalizedEquipment === equipment;
      const matchesDifficulty = difficulty === allOption || exercise.difficulty === difficulty;
      const hasDemo = Boolean(toEmbeddableVideoUrl(exercise.demoUrl));
      const matchesDemo = demoFilter === allOption
        || (demoFilter === "Has demo" && hasDemo)
        || (demoFilter === "No demo" && !hasDemo);

      return matchesQuery && matchesCategory && matchesEquipment && matchesDifficulty && matchesDemo;
    });
  }, [query, category, equipment, difficulty, demoFilter]);

  const selectedExercise = filteredExercises.find((exercise) => exercise.id === selectedExerciseId)
    ?? filteredExercises[0]
    ?? null;

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

  return (
    <div className="exercise-page exercise-page-stable workout-fu">
      <section className="exercise-hero card card-padding workout-card">
        <div>
          <p className="kicker">Exercise library</p>
          <h1 className="exercise-title">Home-friendly exercises.</h1>
        </div>

        <div className="exercise-summary-card">
          <p className="metric-label">Exercises</p>
          <p className="metric-value">{exercises.length}</p>
        </div>
      </section>

      <section className="exercise-controls card workout-card" aria-label="Exercise filters">
        <div className="exercise-control-title">
          <p className="kicker">Find movement</p>
          <h2 className="history-title">Browse by goal, equipment, or muscle.</h2>
        </div>

        <div className="exercise-control-grid">
          <label className="exercise-search-field">
            <span className="field-label">Search</span>
            <input
              className="input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="push-up, legs, dumbbell, core..."
            />
          </label>

          <FilterSelect label="Category" value={category} options={categories} onChange={setCategory} />
          <FilterSelect label="Equipment" value={equipment} options={equipmentOptions} onChange={setEquipment} />
          <FilterSelect label="Difficulty" value={difficulty} options={difficultyOptions} onChange={setDifficulty} />
          <FilterSelect label="Demo" value={demoFilter} options={["Has demo", "No demo"]} onChange={setDemoFilter} />
        </div>

        <div className="exercise-filter-footer">
          <p className="exercise-count-line">
            Showing <strong>{filteredExercises.length}</strong> of <strong>{exercises.length}</strong>
            {activeFilterCount > 0 ? ` · ${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}` : ""}
          </p>
          <button className="btn btn-soft" type="button" onClick={clearFilters} disabled={activeFilterCount === 0}>
            Clear filters
          </button>
        </div>
      </section>

      <section className="exercise-browser card workout-card">
        <div className="exercise-browser-header">
          <div>
            <p className="kicker">Results</p>
            <h2 className="history-title">{filteredExercises.length} exercises found</h2>
          </div>
          {selectedExercise && <span className="exercise-selected-pill">Selected: {selectedExercise.name}</span>}
        </div>

        <div className={`exercise-browser-body ${toEmbeddableVideoUrl(selectedExercise?.demoUrl) ? "has-demo" : "no-demo"}`}>
          <div className="exercise-list" aria-label="Exercise results">
            {filteredExercises.length === 0 ? (
              <div className="empty-state">No exercises match the current filters.</div>
            ) : (
              filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => setSelectedExerciseId(exercise.id)}
                  className={`exercise-row ${selectedExercise?.id === exercise.id ? "selected" : ""}`}
                >
                  <div>
                    <p className="exercise-row-name">{exercise.name}</p>
                    <p className="exercise-row-meta">
                      {exercise.category} · {exercise.difficulty} · {normalizeEquipment(exercise.equipment)}
                    </p>
                  </div>
                  <div className="exercise-row-actions">
                    <span className="set-count-pill">{exercise.movementType}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          <ExerciseDetail exercise={selectedExercise} />
        </div>
      </section>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="filter-field">
      <span className="field-label">{label}</span>
      <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value={allOption}>All</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ExerciseDetail({ exercise }) {
  if (!exercise) {
    return (
      <div className="exercise-detail">
        <div className="empty-state">Select an exercise to view details.</div>
      </div>
    );
  }

  const embedUrl = toEmbeddableVideoUrl(exercise.demoUrl);
  return (
    <article className="exercise-detail">
      <div className="exercise-detail-card">
        <div className="exercise-detail-top exercise-detail-top-stacked">
          <div className="exercise-detail-main">
            <p className="kicker">Exercise detail</p>
            <h2 className="exercise-detail-title">{exercise.name}</h2>
            <p className="exercise-detail-copy">{exercise.description}</p>

            <div className="exercise-badge-grid">
              <InfoBadge label="Category" value={exercise.category} />
              <InfoBadge label="Difficulty" value={exercise.difficulty} />
              <InfoBadge label="Equipment" value={normalizeEquipment(exercise.equipment)} />
              <InfoBadge label="Rest" value={`${exercise.defaultRestSeconds}s`} />
            </div>
          </div>
        </div>

        <div className="exercise-prescription exercise-prescription-compact">
          <div>
            <p className="metric-label">Default sets</p>
            <p className="mini-value compact">{exercise.defaultSets}</p>
          </div>
          <div>
            <p className="metric-label">Default reps</p>
            <p className="mini-value compact">{exercise.defaultReps}</p>
          </div>
          <div>
            <p className="metric-label">Movement</p>
            <p className="mini-value compact">{exercise.movementType}</p>
          </div>
        </div>

        <section className="exercise-section-block exercise-muscle-block">
          <p className="kicker">Target muscles</p>
          <div className="pill-wrap">
            {(exercise.primaryMuscles ?? []).map((muscle) => (
              <span className="rating-pill" key={muscle}>{muscle}</span>
            ))}
          </div>
        </section>

        <section className="exercise-video-card exercise-video-card-large" aria-label="Demo video">
          <div className="exercise-demo-header">
            <div>
              <p className="kicker">Demo video</p>
              <h3 className="exercise-video-title">Watch the movement</h3>
            </div>
            {exercise.demoUrl && (
              <a className="exercise-demo-link" href={exercise.demoUrl} target="_blank" rel="noreferrer">
                Open video
              </a>
            )}
          </div>

          {embedUrl ? (
            <div className="exercise-video-frame exercise-video-frame-large">
              <iframe
                title={`${exercise.name} demo video`}
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <NoDemoPanel exercise={exercise} />
          )}
        </section>
      </div>
    </article>
  );
}

function NoDemoPanel({ exercise }) {
  return (
    <div className="exercise-no-demo-panel-simple">
      <div className="exercise-no-demo-message">
        <p className="kicker">No demo video</p>
        <h4>No demo video added for this exercise.</h4>
        {exercise?.demoUrl && (
          <a className="exercise-demo-link" href={exercise.demoUrl} target="_blank" rel="noreferrer">
            Open video source
          </a>
        )}
      </div>
    </div>
  );
}

function InfoBadge({ label, value }) {
  return (
    <div className="info-badge">
      <p className="metric-label">{label}</p>
      <p>{value}</p>
    </div>
  );
}

function getUniqueValues(values) {
  return [...new Set(values.filter(Boolean).map(normalizeEquipment))].sort((a, b) => a.localeCompare(b));
}

function normalizeEquipment(value) {
  const text = String(value ?? "").trim();
  if (["dumbbells", "dumbells", "dumbell"].includes(text.toLowerCase())) return "Dumbbell";
  return text;
}

function toEmbeddableVideoUrl(url) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com") && parsedUrl.pathname === "/watch") {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    if (parsedUrl.hostname.includes("youtube.com") && parsedUrl.pathname.startsWith("/embed/")) {
      return url;
    }

    if (parsedUrl.hostname.includes("vimeo.com")) {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : "";
    }

    return "";
  } catch {
    return "";
  }
}

export default ExerciseLibraryPage;
