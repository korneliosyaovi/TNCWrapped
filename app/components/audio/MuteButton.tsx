"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "../providers/AudioProvider";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/app/types";
import { playSFX } from "./SoundEffects";
import { MutedIcon, UnmutedIcon } from "./AudioIcons";

export default function MuteButton() {
  const { isMuted, toggleMute, isPlaying } = useAudio();
  const { trackEvent } = useAnalytics();

  const handleToggle = () => {
    // Play a click SFX if audio is currently unmuted so the user hears
    // feedback before the toggle takes effect.
    try {
      if (!isMuted) {
        playSFX("click");
      }
    } catch (sfxErr) {
      // Non-fatal: log for diagnostics but don't block toggle
      // eslint-disable-next-line no-console
      console.error("MuteButton: playSFX error", sfxErr);
    }

    trackEvent({
      name: ANALYTICS_EVENTS.BUTTON_CLICKED,
      params: { button_name: "toggle_mute", muted: !isMuted },
    });

    toggleMute();
  };
  // Render AnimatePresence always; show the button only when playing so
  // the exit animation can run when `isPlaying` becomes false.
  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.button
          key="mute-button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className="fixed top-6 right-6 z-40 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? (
            <MutedIcon className="w-6 h-6" />
          ) : (
            <UnmutedIcon className="w-6 h-6" />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}