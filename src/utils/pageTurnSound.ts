let audioContext: AudioContext | null = null;

/**
 * Creates a short, soft paper-rustle sound without loading an external file.
 * It must be called from a user interaction so browser autoplay rules are met.
 */
export const playPageTurnSound = () => {
  try {
    const AudioContextClass = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;
    audioContext ??= new AudioContextClass();
    const context = audioContext;

    if (context.state === 'suspended') {
      void context.resume();
    }

    const duration = 0.42;
    const frameCount = Math.floor(context.sampleRate * duration);
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const samples = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i += 1) {
      const progress = i / frameCount;
      const envelope = Math.sin(Math.PI * progress) * (1 - progress * 0.35);
      const grain = Math.random() * 2 - 1;
      const flutter = 0.72 + Math.sin(progress * Math.PI * 18) * 0.18;
      samples[i] = grain * envelope * flutter;
    }

    const source = context.createBufferSource();
    const highPass = context.createBiquadFilter();
    const lowPass = context.createBiquadFilter();
    const gain = context.createGain();

    highPass.type = 'highpass';
    highPass.frequency.setValueAtTime(520, context.currentTime);
    lowPass.type = 'lowpass';
    lowPass.frequency.setValueAtTime(4200, context.currentTime);
    lowPass.frequency.exponentialRampToValueAtTime(1500, context.currentTime + duration);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

    source.buffer = buffer;
    source.playbackRate.value = 0.94 + Math.random() * 0.12;
    source.connect(highPass).connect(lowPass).connect(gain).connect(context.destination);
    source.start();
    source.stop(context.currentTime + duration);
  } catch {
    // Sound is decorative; navigation must still work if audio is unavailable.
  }
};
