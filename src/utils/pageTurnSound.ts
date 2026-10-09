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

    // Four seconds: lift, bend, sweep and a soft landing of a real paper leaf.
    const duration = 4;
    const frameCount = Math.floor(context.sampleRate * duration);
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const samples = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i += 1) {
      const progress = i / frameCount;
      const lift = Math.exp(-Math.pow((progress - 0.16) / 0.11, 2));
      const sweep = Math.exp(-Math.pow((progress - 0.48) / 0.22, 2));
      const landing = Math.exp(-Math.pow((progress - 0.82) / 0.08, 2));
      const envelope = Math.min(1, lift * 0.55 + sweep * 0.82 + landing * 0.42);
      const grain = Math.random() * 2 - 1;
      const flutter = 0.76 + Math.sin(progress * Math.PI * 42) * 0.13
        + Math.sin(progress * Math.PI * 113) * 0.07;
      samples[i] = grain * envelope * flutter;
    }

    const source = context.createBufferSource();
    const highPass = context.createBiquadFilter();
    const lowPass = context.createBiquadFilter();
    const gain = context.createGain();

    highPass.type = 'highpass';
    highPass.frequency.setValueAtTime(520, context.currentTime);
    lowPass.type = 'lowpass';
    lowPass.frequency.setValueAtTime(1800, context.currentTime);
    lowPass.frequency.exponentialRampToValueAtTime(5200, context.currentTime + 1.7);
    lowPass.frequency.exponentialRampToValueAtTime(1200, context.currentTime + duration);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.105, context.currentTime + 0.22);
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
