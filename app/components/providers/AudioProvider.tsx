"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";
import { AudioState, AudioActions } from "@/app/types";

// Default playback volume for audio (0 = silent, 1 = full)
const DEFAULT_PLAYBACK_VOLUME = 0.5;

type AudioContextType = AudioState & AudioActions;

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false); // Has user interacted?
  const [audioError, setAudioError] = useState<Error | null>(null);
  
  const howlRef = useRef<Howl | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Initialize audio context after first user interaction
   * Required for mobile browsers
   */
  const initializeAudio = useCallback(() => {
    setIsReady((prevReady) => {
      if (!prevReady) {
        console.log("Audio context initialized");
        return true;
      }
      return prevReady;
    });
  }, []);

  /**
   * Clear audio error state
   */
  const clearAudioError = useCallback(() => {
    setAudioError(null);
  }, []);

  /**
   * Play a track with fade in/out
   */
  const playTrack = useCallback((trackUrl: string, fadeInDuration: number = 1000) => {
    // If same track is already playing, do nothing
    if (currentTrack === trackUrl && isPlaying) {
      return;
    }

    // Initialize audio on first play
    initializeAudio();

    // Clear any pending fade timeouts
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    // Fade out and stop current track if exists
    if (howlRef.current) {
      const oldHowl = howlRef.current;
      
      // Fade out over 500ms
      oldHowl.fade(oldHowl.volume(), 0, 500);
      
      fadeTimeoutRef.current = setTimeout(() => {
        oldHowl.stop();
        oldHowl.unload();
      }, 500);
    }

    // Create new Howl instance
    const sound = new Howl({
      src: [trackUrl],
      html5: true, // Use HTML5 Audio for streaming
      loop: true,
      volume: 0, // Start at 0 for fade in
      onload: () => {
        setAudioError(null);
        console.log("Audio loaded:", trackUrl);
      },
      onplay: () => {
        setIsPlaying(true);
        setAudioError(null);
        console.log("Audio playing:", trackUrl);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onend: () => {
        setIsPlaying(false);
      },
      onloaderror: (id: number, error: any) => {
        const err = error instanceof Error ? error : new Error(String(error));
        setAudioError(err);
        console.error("Audio load error:", err);
      },
      onplayerror: (id: number, error: any) => {
        const err = error instanceof Error ? error : new Error(String(error));
        setAudioError(err);
        console.error("Audio play error:", err);
        // Try to unlock audio on play error
        sound.once('unlock', () => {
          sound.play();
        });
      },
    });

    howlRef.current = sound;
    setCurrentTrack(trackUrl);

    // Play the track
    sound.play();

    // Fade in
    if (!isMuted) {
      sound.fade(0, DEFAULT_PLAYBACK_VOLUME, fadeInDuration);
    }
  }, [currentTrack, isPlaying, isMuted, initializeAudio]);

  /**
   * Stop current track with fade out
   */
  const stopTrack = useCallback((fadeOutDuration: number = 500) => {
    if (howlRef.current) {
      const sound = howlRef.current;
      
      // Fade out
      sound.fade(sound.volume(), 0, fadeOutDuration);
      
      // Stop after fade
      fadeTimeoutRef.current = setTimeout(() => {
        sound.stop();
        sound.unload();
        howlRef.current = null;
        setCurrentTrack(null);
        setIsPlaying(false);
      }, fadeOutDuration);
    }
  }, []);

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMutedState = !prev;
      
      if (howlRef.current) {
        if (newMutedState) {
          // Mute - fade to 0
          howlRef.current.fade(howlRef.current.volume(), 0, 300);
        } else {
          // Unmute - fade to default volume
          howlRef.current.fade(0, DEFAULT_PLAYBACK_VOLUME, 300);
        }
      }
      
      console.log("Audio muted:", newMutedState);
      return newMutedState;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, []);

  const value: AudioContextType = {
    currentTrack,
    isPlaying,
    isMuted,
    audioError,
    playTrack,
    stopTrack,
    toggleMute,
    clearAudioError,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}