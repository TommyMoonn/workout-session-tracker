import { useState } from "react";
import { buttonClass, MarkerLabel } from "@shared/ui";
import { exerciseUi as ui } from "../styles";

export function ExerciseVideo({ exercise }) {
  const [loadedExerciseId, setLoadedExerciseId] = useState(null);
  const isVideoLoaded = loadedExerciseId === exercise?.id;

  return (
    <section className={ui.videoCard}>
      <div className={ui.rowBetween}>
        <div>
          <MarkerLabel>Demo video</MarkerLabel>
          <h3 className={ui.panelTitle}>Watch the movement</h3>
        </div>
        {exercise.demoUrl && (
          <a className={buttonClass("soft")} href={exercise.demoUrl} target="_blank" rel="noreferrer">
            Open video
          </a>
        )}
      </div>

      {exercise.embedUrl ? (
        <div className={isVideoLoaded ? ui.videoFrame : ui.videoLoadPanel}>
          {isVideoLoaded ? (
            <iframe
              className={ui.videoEmbed}
              title={`${exercise.name} demo video`}
              src={exercise.embedUrl}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button type="button" className={ui.videoPlaceholder} onClick={() => setLoadedExerciseId(exercise.id)}>
              <span>
                <MarkerLabel as="span" className={ui.videoMediaLabel}>Demo available</MarkerLabel>
                <strong className={ui.videoPlaceholderTitle}>Load demo video</strong>
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
  );
}
