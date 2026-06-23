import { useEffect, useState } from "react";
import { buttonClass, EmptyBlock, MarkerLabel } from "../../../components/ui";
import { ui } from "../../../styles";

export function ExerciseVideo({ exercise }) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    setIsVideoLoaded(false);
  }, [exercise?.id]);

  return (
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
            <button type="button" className={ui.videoPlaceholder} onClick={() => setIsVideoLoaded(true)}>
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
  );
}
