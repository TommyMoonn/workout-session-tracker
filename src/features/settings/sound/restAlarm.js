const restAlarmVolumeMap = {
  low: 0.04,
  medium: 0.075,
  high: 0.12,
};

export function playChillAlarm(alarmContextsRef, volume = "medium") {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audioContext = new AudioContext();
    alarmContextsRef.current = [...alarmContextsRef.current, audioContext];
    const masterGain = audioContext.createGain();
    const peakVolume = restAlarmVolumeMap[volume] ?? restAlarmVolumeMap.medium;

    masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(peakVolume, audioContext.currentTime + 0.03);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.55);
    masterGain.connect(audioContext.destination);

    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const noteGain = audioContext.createGain();
      const startTime = audioContext.currentTime + index * 0.26;
      const endTime = startTime + 0.5;

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, startTime);
      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.65, startTime + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

      oscillator.connect(noteGain);
      noteGain.connect(masterGain);
      oscillator.start(startTime);
      oscillator.stop(endTime + 0.03);
    });

    window.setTimeout(() => {
      try {
        audioContext.close?.();
      } catch {
        // Ignore closed audio contexts.
      }
      alarmContextsRef.current = alarmContextsRef.current.filter((context) => context !== audioContext);
    }, 1650);
  } catch (error) {
    console.error(error);
  }
}
