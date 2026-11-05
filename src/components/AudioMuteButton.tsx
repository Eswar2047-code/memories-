import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  isMuted,
  isBackgroundMusicPlaying,
  registerInteractionUnlock,
  startBackgroundMusic,
  subscribeAudioState,
  toggleMute,
} from "../experience/audio";

export function AudioMuteButton() {
  const [muted, setMutedState] = useState(false);
  const [playing, setPlayingState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMutedState(isMuted());
    setPlayingState(isBackgroundMusicPlaying());

    // Automatically attempt to start background music when app opens
    void startBackgroundMusic();
    registerInteractionUnlock();

    // Subscribe to any changes from the audio engine
    const unsubscribe = subscribeAudioState(() => {
      setMutedState(isMuted());
      setPlayingState(isBackgroundMusicPlaying());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!mounted) {
    return null;
  }

  const handleToggle = () => {
    const nextMuted = toggleMute();
    setMutedState(nextMuted);
    if (!nextMuted) {
      void startBackgroundMusic();
    }
  };

  return (
    <div className="fixed top-4 right-4 sm:top-5 sm:right-5 z-50">
      <button
        id="audio-mute-button"
        type="button"
        onClick={handleToggle}
        title={muted ? "Unmute background music" : "Mute background music"}
        aria-label={muted ? "Unmute background music" : "Mute background music"}
        className={`pointer-events-auto group relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 active:scale-95 ${
          muted
            ? "border-border/60 bg-deep/80 text-chalk-dim/70 hover:border-gold/40 hover:text-chalk hover:bg-deep/95"
            : "border-gold/40 bg-deep/80 text-gold hover:border-gold hover:text-gold-glow hover:bg-deep/95 shadow-[0_0_15px_-3px_rgba(235,185,90,0.3)]"
        }`}
      >
        {/* Subtle audio playing wave pulse */}
        {!muted && playing && (
          <span
            className="absolute inset-0 rounded-full border border-gold/30 animate-ping opacity-25"
            style={{ animationDuration: "2.4s" }}
          />
        )}

        {muted ? (
          <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
        ) : (
          <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
        )}
      </button>
    </div>
  );
}
