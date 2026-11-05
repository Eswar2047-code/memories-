/**
 * ============================================================
 * GLOBAL AUDIO ENGINE
 * "The Classroom of Memories"
 * ============================================================
 *
 * Features:
 *
 * - Google Drive BGM
 * - Continuous looping
 * - Starts after first user interaction
 * - Play / Pause
 * - Mute / Unmute
 * - Volume control
 * - Persistent volume and mute settings
 * - Cinematic Web Audio effects
 * - Chime
 * - Whoosh
 * - Typing sound
 * - Sparkle
 * - Transition sound
 * - Audio state listeners
 * - Google Drive error handling
 *
 * IMPORTANT:
 * The Google Drive file must be shared as:
 *
 * Anyone with the link → Viewer
 *
 * ============================================================
 */

/* ============================================================
   AUDIO CONFIGURATION
============================================================ */

/**
 * Primary background music audio track (local looped audio).
 */
export const DEFAULT_BGM_URL = "/audio/bgm.mp3";

/**
 * Fallback track.
 */
export const FALLBACK_BGM_URL = "/audio/dc-bgm.mp3";

/**
 * Track title displayed in the UI.
 */
export const TRACK_TITLE = "Teachers' Day BGM";

/* ============================================================
   AUDIO STATE
============================================================ */

let ctx: AudioContext | null = null;

let master: GainNode | null = null;

let padStarted = false;

let currentMuted = false;

let currentVolume = 0.65;

let isPlaying = false;

let audioTrackUrl = DEFAULT_BGM_URL;

let activeSourceType: "primary" | "fallback" | "synth" = "primary";

let bgmAudio: HTMLAudioElement | null = null;

/* ============================================================
   AUDIO STATE LISTENERS
============================================================ */

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (error) {
      console.error("Audio listener error:", error);
    }
  });
}

/**
 * Subscribe to audio state changes.
 */
export function subscribeAudioState(fn: () => void): () => void {
  listeners.add(fn);

  return () => {
    listeners.delete(fn);
  };
}

/* ============================================================
   LOCAL STORAGE
============================================================ */

function getStoredVolume(): number {
  if (typeof window === "undefined") {
    return 0.65;
  }

  try {
    const value = localStorage.getItem("classroom_bgm_volume");

    if (value !== null) {
      const numberValue = parseFloat(value);

      if (!Number.isNaN(numberValue) && numberValue >= 0 && numberValue <= 1) {
        return numberValue;
      }
    }
  } catch {
    // Ignore localStorage errors
  }

  return 0.65;
}

/**
 * Get saved mute state.
 */
function getStoredMute(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return localStorage.getItem("classroom_bgm_muted") === "true";
  } catch {
    return false;
  }
}

/**
 * Save audio preferences.
 */
function saveAudioPrefs(volume: number, muted: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem("classroom_bgm_volume", String(volume));

    localStorage.setItem("classroom_bgm_muted", String(muted));
  } catch {
    // Ignore localStorage errors
  }
}

/* ============================================================
   AUDIO CONTEXT
============================================================ */

function ensureAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!ctx) {
    const AudioContextClass =
      window.AudioContext ??
      (
        window as unknown as {
          webkitAudioContext: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextClass) {
      console.warn("Web Audio API is not supported.");

      return null;
    }

    ctx = new AudioContextClass();

    master = ctx.createGain();

    master.gain.value = currentMuted ? 0 : currentVolume * 0.4;

    master.connect(ctx.destination);
  }

  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  return ctx;
}

/* ============================================================
   INITIALIZE BACKGROUND MUSIC
============================================================ */

function initBgmAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") {
    return null;
  }

  /**
   * Reuse existing audio object.
   *
   * This is extremely important because
   * we don't want to create a new audio
   * element every time a scene changes.
   */
  if (bgmAudio) {
    return bgmAudio;
  }

  /**
   * Load preferences.
   */
  currentVolume = getStoredVolume();

  currentMuted = getStoredMute();

  /**
   * Always use Google Drive as the
   * primary audio source.
   */
  audioTrackUrl = DEFAULT_BGM_URL;

  activeSourceType = "primary";

  /**
   * Create HTML audio element.
   */
  const audio = new Audio();

  /**
   * Continuous looping.
   */
  audio.loop = true;

  /**
   * Preload audio.
   */
  audio.preload = "auto";

  /**
   * Respect saved volume.
   */
  audio.volume = currentMuted ? 0 : currentVolume;

  /* ----------------------------------------------------------
     PLAY EVENT
  ---------------------------------------------------------- */

  audio.addEventListener("play", () => {
    isPlaying = true;

    notify();
  });

  /* ----------------------------------------------------------
     PAUSE EVENT
  ---------------------------------------------------------- */

  audio.addEventListener("pause", () => {
    isPlaying = false;

    notify();
  });

  /* ----------------------------------------------------------
     ENDED EVENT
  ---------------------------------------------------------- */

  audio.addEventListener("ended", () => {
    /**
     * loop=true should prevent this.
     * Keep state safe anyway.
     */
    isPlaying = false;

    notify();
  });

  /* ----------------------------------------------------------
     ERROR EVENT
  ---------------------------------------------------------- */

  audio.addEventListener("error", () => {
    console.error("Unable to load Google Drive BGM.");

    /**
     * Try local fallback.
     */
    if (audioTrackUrl !== FALLBACK_BGM_URL) {
      console.info("Switching to local fallback BGM...");

      audioTrackUrl = FALLBACK_BGM_URL;

      activeSourceType = "fallback";

      audio.src = FALLBACK_BGM_URL;

      audio.load();

      notify();
    } else {
      console.error("Both primary and fallback BGM failed.");
    }
  });

  /* ----------------------------------------------------------
     LOAD AUDIO
  ---------------------------------------------------------- */

  audio.src = audioTrackUrl;

  bgmAudio = audio;

  return audio;
}

/* ============================================================
   START BACKGROUND MUSIC
============================================================ */

/**
 * Start background music.
 *
 * IMPORTANT:
 * Browser autoplay policies require
 * user interaction.
 *
 * Therefore call this from:
 *
 * - Enter button
 * - Click
 * - Touch
 * - Keypress
 */
export function startBackgroundMusic(): Promise<void> {
  const audio = initBgmAudio();

  ensureAudioContext();

  if (!audio) {
    isPlaying = false;

    notify();

    return Promise.resolve();
  }

  audio.volume = currentMuted ? 0 : currentVolume;

  return audio
    .play()
    .then(() => {
      isPlaying = true;

      notify();
    })
    .catch((error) => {
      console.info("Browser prevented autoplay. Waiting for user interaction.", error);

      isPlaying = false;

      notify();
    });
}

/* ============================================================
   PAUSE BACKGROUND MUSIC
============================================================ */

export function pauseBackgroundMusic() {
  if (!bgmAudio) {
    return;
  }

  bgmAudio.pause();

  isPlaying = false;

  notify();
}

/* ============================================================
   TOGGLE PLAY / PAUSE
============================================================ */

export function toggleBackgroundMusic() {
  const audio = initBgmAudio();

  if (!audio) {
    return;
  }

  ensureAudioContext();

  if (audio.paused) {
    audio.volume = currentMuted ? 0 : currentVolume;

    void audio
      .play()
      .then(() => {
        isPlaying = true;

        notify();
      })
      .catch((error) => {
        console.error("Unable to start BGM:", error);
      });
  } else {
    audio.pause();

    isPlaying = false;

    notify();
  }
}

/* ============================================================
   VOLUME CONTROL
============================================================ */

export function setBackgroundMusicVolume(volume: number) {
  /**
   * Clamp volume between 0 and 1.
   */
  currentVolume = Math.max(0, Math.min(1, volume));

  /**
   * Update HTML audio.
   */
  if (bgmAudio) {
    bgmAudio.volume = currentMuted ? 0 : currentVolume;
  }

  /**
   * Update Web Audio effects.
   */
  if (master && ctx) {
    master.gain.setValueAtTime(currentMuted ? 0 : currentVolume * 0.4, ctx.currentTime);
  }

  /**
   * Save preference.
   */
  saveAudioPrefs(currentVolume, currentMuted);

  notify();
}

/* ============================================================
   GET VOLUME
============================================================ */

export function getBackgroundMusicVolume(): number {
  return currentVolume;
}

/* ============================================================
   PLAYING STATE
============================================================ */

export function isBackgroundMusicPlaying(): boolean {
  return isPlaying && !!bgmAudio && !bgmAudio.paused;
}

/* ============================================================
   TRACK INFORMATION
============================================================ */

export function getActiveTrackInfo(): {
  title: string;
  url: string;
  sourceType: "primary" | "fallback" | "synth";
} {
  return {
    title: TRACK_TITLE,

    url: audioTrackUrl,

    sourceType: activeSourceType,
  };
}

/* ============================================================
   CUSTOM AUDIO TRACK
============================================================ */

/**
 * Allows another audio URL to be used.
 *
 * Passing an empty string resets to
 * the Google Drive BGM.
 */
export function setCustomAudioTrack(url: string) {
  /**
   * Reset to primary Google Drive audio.
   */
  if (!url || !url.trim()) {
    audioTrackUrl = DEFAULT_BGM_URL;

    activeSourceType = "primary";

    try {
      localStorage.removeItem("classroom_custom_audio_url");
    } catch {
      // Ignore
    }
  } else {
    /**
     * Use supplied custom audio.
     */
    audioTrackUrl = url.trim();

    activeSourceType = "fallback";

    try {
      localStorage.setItem("classroom_custom_audio_url", audioTrackUrl);
    } catch {
      // Ignore
    }
  }

  /**
   * Update existing audio element.
   */
  if (bgmAudio) {
    const wasPlaying = isPlaying;

    bgmAudio.pause();

    bgmAudio.src = audioTrackUrl;

    bgmAudio.load();

    bgmAudio.volume = currentMuted ? 0 : currentVolume;

    if (wasPlaying) {
      void bgmAudio.play().catch((error) => {
        console.error("Unable to restart audio:", error);
      });
    }
  } else {
    initBgmAudio();
  }

  notify();
}

/* ============================================================
   CINEMATIC SYNTH AMBIENCE
============================================================ */

/**
 * Creates a very soft ambient pad.
 *
 * This is independent from the main BGM.
 */
export function startAmbience() {
  const audioContext = ensureAudioContext();

  if (!audioContext || !master || padStarted) {
    return;
  }

  padStarted = true;

  const notes = [110, 164.81, 220, 329.63];

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();

    const gain = audioContext.createGain();

    const lfo = audioContext.createOscillator();

    const lfoGain = audioContext.createGain();

    oscillator.type = index % 2 ? "sine" : "triangle";

    oscillator.frequency.value = frequency;

    gain.gain.value = 0;

    gain.gain.linearRampToValueAtTime(0.06 / (index + 1), audioContext.currentTime + 4);

    lfo.frequency.value = 0.05 + index * 0.03;

    lfoGain.gain.value = 0.02;

    lfo.connect(lfoGain).connect(gain.gain);

    oscillator.connect(gain).connect(master!);

    oscillator.start();

    lfo.start();
  });
}

/* ============================================================
   AUDIO CUES
============================================================ */

export type Cue = "chime" | "whoosh" | "type" | "sparkle" | "transition";

/**
 * Play cinematic sound effect.
 */
export function playCue(cue: Cue) {
  const audioContext = ensureAudioContext();

  if (!audioContext || !master) {
    return;
  }

  const now = audioContext.currentTime;

  /* ==========================================================
     WHOOSH
  ========================================================== */

  if (cue === "whoosh") {
    const buffer = audioContext.createBuffer(
      1,
      audioContext.sampleRate * 1.4,
      audioContext.sampleRate,
    );

    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2;
    }

    const source = audioContext.createBufferSource();

    const filter = audioContext.createBiquadFilter();

    filter.type = "bandpass";

    filter.frequency.setValueAtTime(300, now);

    filter.frequency.exponentialRampToValueAtTime(3200, now + 1.1);

    const gain = audioContext.createGain();

    gain.gain.value = currentMuted ? 0 : 0.4;

    source.buffer = buffer;

    source.connect(filter).connect(gain).connect(master);

    source.start();

    return;
  }

  /* ==========================================================
     OTHER CUES
  ========================================================== */

  const frequency =
    cue === "chime" ? 880 : cue === "sparkle" ? 1760 : cue === "transition" ? 528 : 420;

  const oscillator = audioContext.createOscillator();

  const gain = audioContext.createGain();

  oscillator.type = cue === "type" ? "square" : "sine";

  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(currentMuted ? 0 : cue === "type" ? 0.03 : 0.12, now);

  gain.gain.exponentialRampToValueAtTime(0.0001, now + (cue === "type" ? 0.06 : 1.1));

  oscillator.connect(gain).connect(master);

  oscillator.start(now);

  oscillator.stop(now + (cue === "type" ? 0.08 : 1.2));
}

/* ============================================================
   MUTE
============================================================ */

export function isMuted(): boolean {
  return currentMuted;
}

/**
 * Toggles mute state and returns the new muted state.
 */
export function toggleMute(): boolean {
  const next = !currentMuted;
  setMuted(next);
  if (!next && bgmAudio && bgmAudio.paused) {
    void startBackgroundMusic();
  }
  return next;
}

/**
 * Set mute state.
 */
export function setMuted(muted: boolean) {
  currentMuted = muted;

  /**
   * Update BGM.
   */
  if (bgmAudio) {
    bgmAudio.volume = muted ? 0 : currentVolume;
  }

  /**
   * Update Web Audio effects.
   */
  const audioContext = ensureAudioContext();

  if (audioContext && master) {
    master.gain.linearRampToValueAtTime(
      muted ? 0 : currentVolume * 0.4,
      audioContext.currentTime + 0.2,
    );
  }

  /**
   * Save preference.
   */
  saveAudioPrefs(currentVolume, currentMuted);

  notify();
}

/* ============================================================
   FIRST USER INTERACTION
============================================================ */

let unlockRegistered = false;

/**
 * Register browser interaction.
 *
 * Browsers block autoplay until the user interacts.
 */
export function registerInteractionUnlock() {
  if (typeof window === "undefined" || unlockRegistered) {
    return;
  }

  unlockRegistered = true;

  const unlock = () => {
    /**
     * Unlock Web Audio.
     */
    ensureAudioContext();

    /**
     * Start actual BGM.
     *
     * Because this function is executed
     * inside a user interaction event,
     * browsers generally allow playback.
     */
    void startBackgroundMusic();

    /**
     * Remove listeners.
     */
    window.removeEventListener("click", unlock);
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };

  window.addEventListener("click", unlock, {
    once: true,
    passive: true,
  });

  window.addEventListener("pointerdown", unlock, {
    once: true,
    passive: true,
  });

  window.addEventListener("keydown", unlock, {
    once: true,
    passive: true,
  });

  window.addEventListener("touchstart", unlock, {
    once: true,
    passive: true,
  });
}

/* ============================================================
   AUTOMATIC REGISTRATION
============================================================ */

if (typeof window !== "undefined") {
  registerInteractionUnlock();
}
