"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

type AudioContextType = {
  muted: boolean;
  toggleMute: () => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used inside AudioGate");
  return ctx;
}

export default function AudioGate({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    audioRef.current?.play().catch(() => {});

    const unlock = () => {
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {});
        setMuted(false);
      }
      document.removeEventListener("click", unlock);
    };

    document.addEventListener("click", unlock);
    return () => document.removeEventListener("click", unlock);
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
    audioRef.current.play().catch(() => {});
  };

  return (
    <AudioContext.Provider value={{ muted, toggleMute }}>
      <audio
        ref={audioRef}
        src="/audio/Alagbara.mp3"
        loop
        autoPlay
        muted={muted}
      />
      {children}
    </AudioContext.Provider>
  );
}
