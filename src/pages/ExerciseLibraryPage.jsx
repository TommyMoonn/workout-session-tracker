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

  const categories = useMemo(() => unique(exercises.map((item) => item.category)), []);
  const equipmentOptions = useMemo(() => unique(exercises.map((item) => normalizeEquipment(item.equipment))), []);
  const difficultyOptions = useMemo(() => unique(exercises.map((item) => item.difficulty)), []);

  const filteredExercises = useMemo(() => {
    const queryTokens = tokenizeSearch(query);

    return exercises.filter((exercise) => {
      const normalizedEquipment = normalizeEquipment(exercise.equipment);
      const hasDemo = Boolean(toEmbeddableVideoUrl(exercise.demoUrl));
      const searchableText = buildExerciseSearchText(exercise, normalizedEquipment);

      return (
        matchesSearchTokens(searchableText, queryTokens)
        && (category === allOption || exercise.category === category)
        && (equipment === allOption || normalizedEquipment === equipment)
        && (difficulty === allOption || exercise.difficulty === difficulty)
        && (demoFilter === allOption || (demoFilter === "Has demo" ? hasDemo : !hasDemo))
      );
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
    <div className="space-y-5 font-sans">
      <section className="flex flex-col gap-4 border-2 border-black bg-white p-5 shadow-[7px_7px_0_#050505] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C2410C]">Exercise library</p>
          <h1 className="mt-2 text-4xl font-black leading-none tracking-[-0.06em] md:text-6xl">Home-friendly exercises.</h1>
        </div>
        <div className="grid min-h-[92px] min-w-[116px] place-items-center border-2 border-black bg-[#FFF1E6] px-5 py-4 text-center shadow-[4px_4px_0_#050505]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-neutral-600">Exercises</p>
            <p className="mt-1 font-mono text-3xl font-black leading-none tracking-[-0.08em]">{exercises.length}</p>
          </div>
        </div>
      </section>

      <section className="border-2 border-black bg-white p-5 shadow-[7px_7px_0_#050505]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C2410C]">Find movement</p>
            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Browse by goal, equipment, muscle, or demo.</h2>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            disabled={activeFilterCount === 0}
            className="border-2 border-black bg-[#FFF1E6] px-4 py-3 text-xs font-black uppercase tracking-[0.1em] shadow-[4px_4px_0_#050505] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#050505] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#050505]"
          >
            Clear filters
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_repeat(4,1fr)]">
          <TextFilter value={query} onChange={setQuery} />
          <FilterSelect label="Category" value={category} options={categories} onChange={setCategory} />
          <FilterSelect label="Equipment" value={equipment} options={equipmentOptions} onChange={setEquipment} />
          <FilterSelect label="Difficulty" value={difficulty} options={difficultyOptions} onChange={setDifficulty} />
          <FilterSelect label="Demo" value={demoFilter} options={["Has demo", "No demo"]} onChange={setDemoFilter} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-black pt-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-neutral-600">
            Showing <span className="text-black">{filteredExercises.length}</span> of <span className="text-black">{exercises.length}</span> exercises
          </p>
          <span className="border-2 border-black bg-[#FFF1E6] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] shadow-[2px_2px_0_#050505]">
            {activeFilterCount > 0 ? `${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}` : "No active filters"}
          </span>
        </div>
      </section>

      <section className="border-2 border-black bg-white shadow-[7px_7px_0_#050505]">
        <div className="flex flex-col gap-3 border-b-2 border-black p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C2410C]">Results</p>
            <h2 className="mt-1 text-3xl font-black tracking-[-0.05em]">{filteredExercises.length} exercises found</h2>
          </div>
          {selectedExercise && (
            <span className="w-fit border-2 border-black bg-[#FFF1E6] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] shadow-[3px_3px_0_#050505]">
              Selected: {selectedExercise.name}
            </span>
          )}
        </div>

        <div className="grid items-start lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="h-[980px] overflow-y-auto border-b-2 border-black lg:border-b-0 lg:border-r-2">
            {filteredExercises.length === 0 ? (
              <div className="m-5 border-2 border-dashed border-black bg-[#FFF1E6] p-6 text-sm font-black text-neutral-600">
                No exercises match the current filters.
              </div>
            ) : (
              filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => setSelectedExerciseId(exercise.id)}
                  className={`flex w-full items-start justify-between gap-3 border-b-2 border-black px-4 py-4 text-left transition hover:bg-[#FFF7ED] ${selectedExercise?.id === exercise.id ? "bg-[#FFF1E6]" : "bg-white"}`}
                >
                  <div className="min-w-0">
                    <p className="text-base font-black tracking-[-0.02em]">{exercise.name}</p>
                    <p className="mt-2 text-[11px] font-black uppercase leading-snug tracking-[0.06em] text-slate-600">
                      {exercise.category} · {exercise.difficulty} · {normalizeEquipment(exercise.equipment)}
                    </p>
                  </div>
                  <span className="shrink-0 border-2 border-black bg-white px-2 py-2 text-xs font-black shadow-[2px_2px_0_#050505]">
                    {exercise.movementType}
                  </span>
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
    <label>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-black">Search</span>
      <input
        className="w-full border-2 border-black bg-white px-4 py-3 font-bold outline-none shadow-[3px_3px_0_#050505] focus:bg-[#FFF1E6] focus:shadow-[5px_5px_0_#F97316]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="push up, pull up, legs, dumbbell, core..."
      />
    </label>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-black">{label}</span>
      <select
        className="w-full border-2 border-black bg-white px-4 py-3 font-bold outline-none shadow-[3px_3px_0_#050505] focus:bg-[#FFF1E6] focus:shadow-[5px_5px_0_#F97316]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
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
    return <div className="p-5"><div className="border-2 border-dashed border-black bg-[#FFF1E6] p-6 font-black text-neutral-600">Select an exercise to view details.</div></div>;
  }

  const embedUrl = toEmbeddableVideoUrl(exercise.demoUrl);

  return (
    <article className="p-5 lg:p-7">
      <div className="border-2 border-black bg-white p-5 shadow-[6px_6px_0_#050505]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C2410C]">Exercise detail</p>
        <h2 className="mt-3 text-4xl font-black leading-none tracking-[-0.06em] md:text-6xl">{exercise.name}</h2>
        <p className="mt-4 text-sm font-black leading-relaxed text-slate-600">{exercise.description}</p>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InfoBadge label="Category" value={exercise.category} />
          <InfoBadge label="Difficulty" value={exercise.difficulty} />
          <InfoBadge label="Equipment" value={normalizeEquipment(exercise.equipment)} />
          <InfoBadge label="Rest" value={`${exercise.defaultRestSeconds}s`} />
          <InfoBadge label="Default sets" value={exercise.defaultSets} />
          <InfoBadge label="Default reps" value={exercise.defaultReps} />
          <InfoBadge label="Movement" value={exercise.movementType} />
        </div>

        <div className="mt-5 border-t-2 border-black pt-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#C2410C]">Target muscles</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(exercise.primaryMuscles ?? []).map((muscle) => (
              <span key={muscle} className="border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase shadow-[2px_2px_0_#050505]">
                {muscle}
              </span>
            ))}
          </div>
        </div>

        <section className="mt-6 bg-black p-4 text-white shadow-[5px_5px_0_#050505]">
          <div className="flex items-start justify-between gap-3 border-b-2 border-white pb-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white">Demo video</p>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.04em]">Watch the movement</h3>
            </div>
            {exercise.demoUrl && (
              <a
                className="border-2 border-white bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-black"
                href={exercise.demoUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open video
              </a>
            )}
          </div>

          {embedUrl ? (
            <div className="mt-4 aspect-video border-2 border-white bg-black">
              <iframe
                className="h-full w-full"
                title={`${exercise.name} demo video`}
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="mt-4 grid aspect-video place-items-center border-2 border-white bg-black p-8 text-center">
              <div className="border-2 border-dashed border-white px-8 py-10">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white">No demo video</p>
                <p className="mt-3 max-w-lg text-3xl font-black leading-tight tracking-[-0.04em]">
                  No demo video added for this exercise.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}

function InfoBadge({ label, value }) {
  return (
    <div className="border-2 border-black bg-[#FFF1E6] p-4 shadow-[3px_3px_0_#050505]">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-600">{label}</p>
      <p className="mt-2 font-black">{value}</p>
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
