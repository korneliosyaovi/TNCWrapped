"use client";

import { useEffect } from "react";
import { useFlow } from "../providers/FlowProvider";
import { useAudio } from "../providers/AudioProvider";
import { getAudioForScreen } from "./audioConfig";

/**
 * AudioManager - Handles automatic audio playback based on current screen
 * This component doesn't render anything, it just manages audio state
 */
export default function AudioManager() {
  const { currentScreen } = useFlow();
  const { playTrack, stopTrack } = useAudio();

  useEffect(() => {
    const audioConfig = getAudioForScreen(currentScreen);

    // Handle play/stop with robust error handling. Use an async IIFE
    // so we can await any Promise-like return values from playTrack/stopTrack
    // while keeping the effect cleanup synchronous.
    (async () => {
      try {
        if (audioConfig) {
          // Play the audio for this screen
          const res = playTrack(audioConfig.src);
          // If the implementation returns a promise, await it and let
          // errors bubble to the catch block below.
          if (typeof res === "object" && res !== null && typeof (res as any).then === "function") {
            await (res as Promise<any>);
          }
        } else {
          // No audio for this screen, stop current track
          stopTrack();
        }
      } catch (err) {
        // Surface errors for visibility. Keep logging minimal but useful.
        console.error("AudioManager: error during play/stop", err);

        // Attempt to stop playback to ensure a clean state after a play failure.
        try {
          stopTrack();
        } catch (stopErr) {
          // Swallow stop errors but log them for diagnostics.
          console.error("AudioManager: error stopping audio after failure", stopErr);
        }
      }
    })();

    // Cleanup function runs when screen changes
    return () => {
      // Optional: You could stop audio here on unmount
      // But we let it continue until next screen decides
    };
  }, [currentScreen, playTrack, stopTrack]);

  return null; // This component doesn't render anything
}