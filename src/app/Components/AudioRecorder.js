"use client";

import { useEffect, useRef, useState } from 'react';

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [animationId, setAnimationId] = useState(null);
  const [source, setSource] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const centerX = WIDTH / 2;
      const centerY = HEIGHT / 2;
      const maxRadius = Math.min(WIDTH, HEIGHT) / 2;
      const numberOfLayers = 5;

      ctx.lineWidth = 2;

      const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
      gradient.addColorStop(0, 'blue');
      gradient.addColorStop(1, 'red');

      ctx.strokeStyle = gradient;

      for (let layer = 0; layer < numberOfLayers; layer++) {
        const radius = maxRadius * (1 - (layer * 0.20));

        ctx.beginPath();
        for (let i = 0; i < bufferLength; i++) {
          const angle = (i / bufferLength) * Math.PI * 2;
          const v = dataArray[i] / 128.0;
          const amplitude = v * radius;
          const x = centerX + Math.cos(angle) * amplitude;
          const y = centerY + Math.sin(angle) * amplitude;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }
      
      setAnimationId(requestAnimationFrame(draw));
    };

    if (analyser) {
      draw();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [analyser]);

  const startVisualization = () => {
    if (!audioContext) {
      const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(newAudioContext);

      const newAnalyser = newAudioContext.createAnalyser();
      newAnalyser.fftSize = 256;
      setAnalyser(newAnalyser);

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const newSource = newAudioContext.createMediaStreamSource(stream);
          newSource.connect(newAnalyser);
          setSource(newSource);
        })
        .catch(err => {
          console.error('Error accessing audio stream: ', err);
        });
    }
  };

  const stopVisualization = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      setAnimationId(null);
    }
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
      setAnalyser(null);
      setSource(null);
    }
  };

  return (
    <div>
      <button onClick={startVisualization}>Start</button>
      <button onClick={stopVisualization}>Stop</button>
      <canvas ref={canvasRef} width="800" height="400"></canvas>
    </div>
  );
};

export default AudioVisualizer;
