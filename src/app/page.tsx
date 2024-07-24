
"use client";
import './globals.css';
import DropAnimation from './components/DropAnimation';
import styles from './styles/DropAnimation.module.scss';
import { useState, useEffect } from 'react';
import { setupAudio, stopAudio } from './utils/audio';
export default function Home() {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    setupAudio(setAudioLevel);
    setIsRecording(true);
  };

  const stopRecording = () => {
    stopAudio();
    setIsRecording(false);
    setAudioLevel(0);
  };

  return (
    <div>
      <div className="controls">
        <button onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
      </div>
      {isRecording && <DropAnimation audioLevel={audioLevel} />}
    </div>
  );
}