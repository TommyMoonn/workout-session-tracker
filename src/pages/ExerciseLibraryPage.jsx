import { useDeferredValue, useEffect, useMemo, useState } from "react";
import exercises from "../data/exercises.json";

const allOption = "All";
const demoFilterOptions = ["Has demo", "No demo"];

const searchableExercises = exercises.map((exercise) => {
  const normalizedEquipment = normalizeEquipment(exercise.equipment);
  const embedUrl = toEmbeddableVideoUrl(exercise.demoUrl);

  return {
    ...exercise,
    normalizedEquipment,
    embedUrl,
    hasDemo: Boolean(embedUrl),
    searchableText: buildExerciseSearchText(exercise, normalizedEquipment),
  };
});

function ExerciseLibraryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allOption);
  const [equipment, setEquipment] = useState(allOption);
  const [difficulty, setDifficulty] = useState(allOption);
  const [demoFilter, setDemoFilter] = useState(allOption);
  const [selectedExerciseId, setSelectedExerciseId] = useState(searchableExercises[0]?.id ?? null);
  const deferredQuery = useDeferredValue(query);

  const categories = useMemo(() => unique(searchableExercises.map((item) => item.category)), []);
  const equipmentOptions = useMemo(() => unique(searchableExercises.map((item) => item.normalizedEquipment)), []);
  const difficultyOptions = useMemo(() => unique(searchableExercises.map((item) => item.difficulty)), []);

  const filteredExercises = useMemo(() => {
    const queryTokens = tokenizeSearch(deferredQuery);

    return searchableExercises.filter((exercise) => (
      matchesSearchTokens(exercise.searchableText, queryTokens)
      && (category === allOption || exercise.category === category)
      && (equipment === allOption || exercise.normalizedEquipment === equipment)
      && (difficulty === allOption || exercise.difficulty === difficulty)
      && (demoFilter === allOption || (demoFilter === "Has demo" ? exercise.hasDemo : !exercise.hasDemo))
    ));
  }, [deferredQuery, category, equipment, difficulty, demoFilter]);

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

  return (
    <div className="exercise-page">
      <section className="page-header block-reveal">
        <div>
          <p className="kicker">Exercise library</p>
          <h1 className="page-title">Exercises</h1>
        </div>
        <div className="count-card">
          <span>Total</span>
          <strong>{searchableExercises.length}</strong>
        </div>
      </section>

      <section className="card card-padding block-reveal block-reveal-1">
        <div className="section-toolbar">
          <div>
            <p className="kicker">Filters</p>
            <h2 className="section-title">Search and narrow the list</h2>
          </div>
          <button type="button" className="btn btn-soft" onClick={clearFilters} disabled={activeFilterCount === 0}>
            Clear filters
          </button>
        </div>

        <div className="exercise-filter-grid">
          <TextFilter value={query} onChange={setQuery} />
          <FilterSelect label="Category" value={category} options={categories} onChange={setCategory} />
          <FilterSelect label="Equipment" value={equipment} options={equipmentOptions} onChange={setEquipment} />
          <FilterSelect label="Difficulty" value={difficulty} options={difficultyOptions} onChange={setDifficulty} />
          <FilterSelect label="Demo" value={demoFilter} options={demoFilterOptions} onChange={setDemoFilter} />
        </div>

        <div className="exercise-filter-footer">
          <p>Showing <strong>{filteredExercises.length}</strong> of <strong>{searchableExercises.length}</strong> exercises</p>
          <span>{activeFilterCount > 0 ? `${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}` : "No active filters"}</span>
        </div>
      </section>

      <section className="card exercise-browser block-reveal block-reveal-2">
        <div className="exercise-browser-header">
          <div>
            <p className="kicker">Results</p>
            <h2 className="section-title">{filteredExercises.length} exercise{filteredExercises.length === 1 ? "" : "s"}</h2>
          </div>
          {selectedExercise && <span className="selected-pill">Selected: {selectedExercise.name}</span>}
        </div>

        <div className="exercise-browser-body">
          <aside className="exercise-list">
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
                      {exercise.category} · {exercise.difficulty} · {exercise.normalizedEquipment}
                    </p>
                  </div>
                  <span className="movement-pill">{exercise.movementType}</span>
                </button>
              ))
            )}
          </aside>

          <ExerciseDetail exercise={selectedExercise} />
        </div>
      </section>
    </div>
  );
}

function TextFilter({ value, onChange }) {
  return (
    <label className="filter-field">
      <span className="field-label">Search</span>
      <input
        className="input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="push up, pull up, legs, dumbbell, core..."
      />
    </label>
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
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    setIsVideoLoaded(false);
  }, [exercise?.id]);

  if (!exercise) {
    return <div className="exercise-detail"><div className="empty-state">Select an exercise to view details.</div></div>;
  }

  return (
    <article className="exercise-detail">
      <div className="exercise-detail-card">
        <p className="kicker">Exercise detail</p>
        <h2 className="exercise-detail-title">{exercise.name}</h2>
        <p className="exercise-detail-copy">{exercise.description}</p>

        <div className="exercise-badge-grid">
          <InfoBadge label="Category" value={exercise.category} />
          <InfoBadge label="Difficulty" value={exercise.difficulty} />
          <InfoBadge label="Equipment" value={exercise.normalizedEquipment} />
          <InfoBadge label="Rest" value={`${exercise.defaultRestSeconds}s`} />
          <InfoBadge label="Default sets" value={exercise.defaultSets} />
          <InfoBadge label="Default reps" value={exercise.defaultReps} />
          <InfoBadge label="Movement" value={exercise.movementType} />
        </div>

        <div className="exercise-section-block">
          <p className="kicker">Target muscles</p>
          <div className="pill-wrap">
            {(exercise.primaryMuscles ?? []).map((muscle) => (
              <span key={muscle} className="muscle-pill">{muscle}</span>
            ))}
          </div>
        </div>

        <section className="exercise-video-card">
          <div className="exercise-demo-header">
            <div>
              <p className="kicker">Demo video</p>
              <h3 className="exercise-video-title">Watch the movement</h3>
            </div>
            {exercise.demoUrl && (
              <a className="btn btn-soft" href={exercise.demoUrl} target="_blank" rel="noreferrer">
                Open video
              </a>
            )}
          </div>

          {exercise.embedUrl ? (
            <div className="exercise-video-frame">
              {isVideoLoaded ? (
                <iframe
                  title={`${exercise.name} demo video`}
                  src={exercise.embedUrl}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  className="exercise-video-placeholder"
                  onClick={() => setIsVideoLoaded(true)}
                >
                  <span className="kicker">Video not loaded</span>
                  <strong>Load demo video</strong>
                  <span>Embedded players are kept off the page until needed to avoid UI jank.</span>
                </button>
              )}
            </div>
          ) : (
            <div className="exercise-demo-empty">
              <p className="kicker">No demo video</p>
              <p>No demo video added for this exercise.</p>
            </div>
          )}
        </section>
      </div>
    </article>
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

function normalizeForSearch(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[-_/]+/g, " ")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactForSearch(value) {
  return normalizeForSearch(value).replace(/\s+/g, "");
}

function tokenizeSearch(value) {
  const normalized = normalizeForSearch(value);
  if (!normalized) return [];

  return normalized
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

function buildExerciseSearchText(exercise, normalizedEquipment) {
  const pieces = [
    exercise.id,
    exercise.name,
    exercise.category,
    normalizedEquipment,
    exercise.difficulty,
    exercise.movementType,
    exercise.description,
    ...(exercise.primaryMuscles ?? []),
    ...(exercise.searchKeywords ?? []),
  ];

  const friendlyText = normalizeForSearch(pieces.join(" "));
  const compactText = pieces.map(compactForSearch).filter(Boolean).join(" ");

  return `${friendlyText} ${compactText}`;
}

function matchesSearchTokens(searchableText, queryTokens) {
  if (queryTokens.length === 0) return true;

  const normalizedText = normalizeForSearch(searchableText);
  const compactText = compactForSearch(searchableText);
  const compactQuery = queryTokens.join("");

  return queryTokens.every((token) => normalizedText.includes(token) || compactText.includes(token))
    || compactText.includes(compactQuery);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
}

function normalizeEquipment(value) {
  const text = String(value ?? "").trim();
  if (!text) return "Bodyweight";
  if (["dumbells", "dumbell", "dumbbells"].includes(text.toLowerCase())) return "Dumbbell";
  return text;
}

function toEmbeddableVideoUrl(url) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
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
