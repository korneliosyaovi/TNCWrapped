/**
 * Audio configuration for each screen
 * Maps screen IDs to audio file paths
 */

import { ScreenId } from "@/app/types";

export interface AudioTrack {
  src: string;
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
}

/**
 * Audio tracks for each screen
 * Add your audio files to public/audio/ directory
 */
export const SCREEN_AUDIO: Partial<Record<ScreenId, AudioTrack>> = {
  welcome: {
    src: "/audio/welcome.mp3",
    volume: 0.5,
    fadeIn: 1000,
    fadeOut: 1000,
  },
  "before-we-begin": {
    src: "/audio/ambient.mp3",
    volume: 0.4,
    fadeIn: 1000,
    fadeOut: 1000,
  },
  "attendance-total": {
    src: "/audio/stats.mp3",
    volume: 0.6,
    fadeIn: 1000,
    fadeOut: 1000,
  },
  streak: {
    src: "/audio/stats.mp3",
    volume: 0.6,
    fadeIn: 1000,
    fadeOut: 1000,
  },
  "top-month-intro": {
    src: "/audio/celebration.mp3",
    volume: 0.5,
    fadeIn: 1000,
    fadeOut: 1000,
  },
  "top-month-detail": {
    src: "/audio/celebration.mp3",
    volume: 0.5,
    fadeIn: 1000,
    fadeOut: 1000,
  },
  "feast-shofar": {
    src: "/audio/ambient.mp3",
    volume: 0.4,
    fadeIn: 1000,
    fadeOut: 1000,
  },
  oxygen: {
    src: "/audio/ambient.mp3",
    volume: 0.4,
    fadeIn: 1000,
    fadeOut: 1000,
  },
  "nxt-conference": {
    src: "/audio/ambient.mp3",
    volume: 0.4,
    fadeIn: 1000,
    fadeOut: 1000,
  },
  "favorite-moments": {
    src: "/audio/ambient.mp3",
    volume: 0.4,
    fadeIn: 1000,
    fadeOut: 1000,
  },
  persona: {
    src: "/audio/outro.mp3",
    volume: 0.5,
    fadeIn: 1500,
    fadeOut: 1500,
  },
  // 'not-found' has no background music (intentional)
};

/**
 * Check if a screen has audio configured
 */
export function hasAudio(screenId: ScreenId): boolean {
  return screenId in SCREEN_AUDIO;
}

/**
 * Get audio config for a screen
 */
export function getAudioForScreen(screenId: ScreenId): AudioTrack | null {
  return SCREEN_AUDIO[screenId] || null;
}