let pageTurnAudio: HTMLAudioElement | null = null;

/** Plays the supplied four-second page-turn recording from the beginning. */
export const playPageTurnSound = () => {
  try {
    pageTurnAudio ??= new Audio('/audio/page-turn.mp3');
    pageTurnAudio.preload = 'auto';
    pageTurnAudio.volume = 0.72;
    pageTurnAudio.currentTime = 0;
    void pageTurnAudio.play();
  } catch {
    // Audio is decorative; page navigation remains available if playback fails.
  }
};
