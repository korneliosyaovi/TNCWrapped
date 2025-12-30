"use client";

import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { SOUND_EFFECTS, SFXType } from "./sfxConfig";
import { useAudio } from "../providers/AudioProvider";

/**
 * SoundEffects - Global sound effects manager
 * Provides a hook to play sound effects from anywhere
 */

// Global SFX cache
const sfxCache: Map<SFXType, Howl> = new Map();

// Preload all sound effects
function preloadSFX() {
  Object.entries(SOUND_EFFECTS).forEach(([key, config]) => {
    if (!sfxCache.has(key as SFXType)) {
      const sound = new Howl({
        src: [config.src],
        volume: config.volume,
        preload: true,
        html5: false, // Use Web Audio API for SFX (better for short sounds)
      });
      sfxCache.set(key as SFXType, sound);
    }
  });
}

/**
 * Play a sound effect
 */
export function playSFX(type: SFXType, volume?: number) {
  const sound = sfxCache.get(type);
  
  if (sound) {
    if (volume !== undefined) {
      sound.volume(volume);
    }
    sound.play();
  } else {
    console.warn(`SFX not found: ${type}`);
  }
}

/**
 * Hook to use sound effects
 */
export function useSFX() {
  const { isMuted } = useAudio();

  const play = (type: SFXType) => {
    // Don't play SFX if audio is muted
    if (isMuted) return;
    
    playSFX(type);
  };

  return { play };
}

/**
 * SoundEffects Provider - Preloads all SFX
 */
export default function SoundEffectsProvider() {
  const hasPreloaded = useRef(false);

  useEffect(() => {
    if (!hasPreloaded.current) {
      preloadSFX();
      hasPreloaded.current = true;
      console.log("Sound effects preloaded");
    }
  }, []);

  return null; // This component doesn't render anything
}