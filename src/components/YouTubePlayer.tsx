import React, { useState, useRef } from "react";
import YouTube, {
  YouTubeProps,
  YouTubePlayer as YTPlayer,
} from "react-youtube";

interface YouTubePlayerProps {
  videoId: string;
  onPlay?: () => void;
  onEnd?: () => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  onPlay,
  onEnd,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);

  // Detect mobile devices (including Android, iOS, and mobile browsers)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      modestbranding: 1,
      fs: 1,
      cc_load_policy: 0,
      iv_load_policy: 3,
      disablekb: 1,
      origin: window.location.origin,
    },
  };

  const onReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    setIsReady(true);

    // Ensure video is paused on load
    event.target.pauseVideo();
  };

  const handleStateChange: YouTubeProps["onStateChange"] = (event) => {
    // YouTube Player States:
    // -1 (unstarted)
    // 0 (ended)
    // 1 (playing)
    // 2 (paused)
    // 3 (buffering)
    // 5 (video cued)

    if (event.data === 1 && !hasStarted) {
      // Video started playing for the first time
      setHasStarted(true);
      onPlay?.();
    }

    if (event.data === 0) {
      // Video ended
      onEnd?.();
    }
  };

  const handlePlayClick = () => {
    if (playerRef.current && isReady) {
      playerRef.current.playVideo();
    }
  };

  return (
  <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl" style={{ paddingTop: '56.25%' }}>
    <div className="absolute inset-0">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={handleStateChange}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
    
    {/* Cover YouTube logo in bottom right corner */}
    <div className="absolute bottom-0 right-0 w-24 h-12 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />
    
    {/* Custom play overlay - only show on desktop devices */}
    {!isMobile && isReady && !hasStarted && (
      <button
        onClick={handlePlayClick}
        className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-20 transition-all flex items-center justify-center group z-10"
        aria-label="Play video"
      >
        <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-red rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl">
          <svg
            className="w-10 h-10 md:w-12 md:h-12 text-white ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </button>
    )}
  </div>
);
};
