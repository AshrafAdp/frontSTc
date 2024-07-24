let audioContext;
let analyser;
let dataArray;
let source;

export const setupAudio = async (onAudioProcess) => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  source = audioContext.createMediaStreamSource(stream);
  analyser = audioContext.createAnalyser();

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  const processAudio = () => {
    analyser.getByteTimeDomainData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / bufferLength;
    onAudioProcess(average);
    requestAnimationFrame(processAudio);
  };

  source.connect(analyser);
  processAudio();
};

export const stopAudio = () => {
  if (source) {
    source.disconnect();
  }
  if (audioContext) {
    audioContext.close();
  }
};
