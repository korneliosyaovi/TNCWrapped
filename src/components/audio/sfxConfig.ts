/**
 * Sound Effects Configuration
 * Short audio cues for user interactions
 */

export type SFXType = "click" | "success" | "error" | "whoosh" | "celebration";

export interface SFX {
  src: string;
  volume: number;
}

/**
 * Sound effects library
 */
export const SOUND_EFFECTS: Record<SFXType, SFX> = {
  click: {
    src: "/audio/sfx/click.mp3",
    volume: 0.3,
  },
  success: {
    src: "/audio/sfx/success.mp3",
    volume: 0.4,
  },
  error: {
    src: "/audio/sfx/error.mp3",
    volume: 0.5,
  },
  whoosh: {
    src: "/audio/sfx/whoosh.mp3",
    volume: 0.3,
  },
  celebration: {
    src: "/audio/sfx/celebration.mp3",
    volume: 0.6,
  },
};