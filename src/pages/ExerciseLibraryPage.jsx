import { useDeferredValue, useEffect, useMemo, useState } from "react";
import exercises from "../data/exercises.json";
import { buttonClass, cx, EmptyBlock, MarkedPill, MarkerLabel, SelectField, ui } from "../styles/ui";

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
    <div className={ui.page}>
      <section className={cx(ui.pageHeader, ui.reveal)}>
        <div>
          <MarkerLabel>Exercise library</MarkerLabel>
          <h1 className={ui.pageTitle}>Exercises</h1>
        </div>
        <div className={ui.countCard}>
          <span className={ui.countLabel}>Total</span>
          <strong className={ui.countValue}>{searchableExercises.length}</strong>
        </div>
      </section>

      <section className={cx(ui.card, ui.cardPadding, ui.reveal1)}>
        <div className={ui.toolbar}>
          <div>
            <MarkerLabel>Filters</MarkerLabel>
            <h2 className={ui.sectionTitle}>Search and narrow the list</h2>
          </div>
          <button type="button" className={buttonClass("soft")} onClick={clearFilters} disabled={activeFilterCount === 0}>
            Clear filters
          </button>
        </div>

        <div className={ui.exerciseFilterGrid}>
          <TextFilter value={query} onChange={setQuery} />
          <FilterSelect label="Category" value={category} options={categories} onChange={setCategory} />
          <FilterSelect label="Equipment" value={equipment} options={equipmentOptions} onChange={setEquipment} />
          <FilterSelect label="Difficulty" value={difficulty} options={difficultyOptions} onChange={setDifficulty} />
          <FilterSelect label="Demo" value={demoFilter} options={demoFilterOptions} onChange={setDemoFilter} />
        </div>

      </section>

      <section className={cx(ui.browserCard, ui.reveal2)}>
        <div className={ui.browserHeader}>
          <div>
            <MarkerLabel>Results</MarkerLabel>
            <h2 className={ui.sectionTitle}>{filteredExercises.length} exercise{filteredExercises.length === 1 ? "" : "s"}</h2>
          </div>
          {selectedExercise && <MarkedPill>Selected: {selectedExercise.name}</MarkedPill>}
        </div>

        <div className={ui.exerciseBrowserBody}>
          <aside className={ui.exerciseList}>
            {filteredExercises.length === 0 ? (
              <EmptyBlock>No exercises match the current filters.</EmptyBlock>
            ) : (
              filteredExercises.map((exercise) => {
                const isSelected = selectedExercise?.id === exercise.id;

                return (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => setSelectedExerciseId(exercise.id)}
                    className={cx(ui.exerciseRow, isSelected && ui.rowSelected)}
                  >
                    <div className="min-w-0">
                      <p className={ui.rowTitle}>{exercise.name}</p>
                      <p className={cx(ui.rowMeta, isSelected && ui.rowMetaSelected)}>
                        {exercise.category} · {exercise.difficulty} · {exercise.normalizedEquipment}
                      </p>
                    </div>
                    <MarkedPill selected={isSelected}>{exercise.movementType}</MarkedPill>
                  </button>
                );
              })
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
    <label className={ui.filterField}>
      <MarkerLabel as="span">Search</MarkerLabel>
      <input
        className={ui.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for workouts"
      />
    </label>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <SelectField label={label} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value={allOption}>All</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </SelectField>
  );
}

function ExerciseDetail({ exercise }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    setIsVideoLoaded(false);
  }, [exercise?.id]);

  if (!exercise) {
    return <div className={ui.detailPane}><EmptyBlock>Select an exercise to view details.</EmptyBlock></div>;
  }

  return (
    <article className={ui.detailPane}>
      <div className={ui.exerciseDetailCard}>
        <MarkerLabel>Exercise detail</MarkerLabel>
        <h2 className={ui.detailTitle}>{exercise.name}</h2>
        <p className={ui.bodyCopy}>{exercise.description}</p>

        <div className={ui.exerciseBadgeGrid}>
          <InfoBadge label="Category" value={exercise.category} />
          <InfoBadge label="Difficulty" value={exercise.difficulty} />
          <InfoBadge label="Equipment" value={exercise.normalizedEquipment} />
          <InfoBadge label="Rest" value={`${exercise.defaultRestSeconds}s`} />
          <InfoBadge label="Default sets" value={exercise.defaultSets} />
          <InfoBadge label="Default reps" value={exercise.defaultReps} />
          <InfoBadge label="Movement" value={exercise.movementType} />
        </div>

        <div className={ui.sectionBlock}>
          <MarkerLabel>Target muscles</MarkerLabel>
          <div className={ui.pillWrap}>
            {(exercise.primaryMuscles ?? []).map((muscle) => (
              <MarkedPill key={muscle}>{muscle}</MarkedPill>
            ))}
          </div>
        </div>

        <section className={ui.videoCard}>
          <div className={ui.rowBetween}>
            <div>
              <MarkerLabel>Demo video</MarkerLabel>
              <h3 className={ui.smallTitle}>Watch the movement</h3>
            </div>
            {exercise.demoUrl && (
              <a className={buttonClass("soft")} href={exercise.demoUrl} target="_blank" rel="noreferrer">
                Open video
              </a>
            )}
          </div>

          {exercise.embedUrl ? (
            <div className={ui.videoFrame}>
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
                  className={ui.videoPlaceholder}
                  onClick={() => setIsVideoLoaded(true)}
                >
                  <span>
                    <MarkerLabel as="span">Video not loaded</MarkerLabel>
                    <strong className={ui.videoPlaceholderTitle}>Load demo video</strong>
                    <span className={ui.videoPlaceholderCopy}>Embedded players are kept off the page until needed to avoid UI jank.</span>
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div className={ui.demoEmpty}>
              <MarkerLabel>No demo video</MarkerLabel>
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
    <div className={ui.infoBadge}>
      <MarkerLabel>{label}</MarkerLabel>
      <p className={ui.infoBadgeValue}>{value}</p>
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
