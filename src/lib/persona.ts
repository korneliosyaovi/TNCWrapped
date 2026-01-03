import { Persona, PersonaType } from "@/types";

/**
 * Calculate persona based on attendance percentage
 */
export function calculatePersona(attendancePercentage: number): PersonaType {
  if (attendancePercentage >= 80) return "consistent-champion";
  if (attendancePercentage >= 60) return "dedicated-disciple";
  if (attendancePercentage >= 40) return "growing-believer";
  if (attendancePercentage >= 20) return "occasional-visitor";
  return "new-member";
}

/**
 * Get persona details for display
 */
export function getPersonaDetails(type: PersonaType): Persona {
  const personas: Record<PersonaType, Persona> = {
    "consistent-champion": {
      type: "consistent-champion",
      title: "Consistent Champion",
      description: "You're a pillar of the community! Your dedication and consistency inspire others to keep showing up.",
      color: "#FFD700", // Gold
      emoji: "🏆",
    },
    "dedicated-disciple": {
      type: "dedicated-disciple",
      title: "Dedicated Disciple",
      description: "Your commitment shines through! You're steadily growing and making your presence felt.",
      color: "#9333EA", // Purple
      emoji: "⭐",
    },
    "growing-believer": {
      type: "growing-believer",
      title: "Growing Believer",
      description: "You're on a journey of growth! Every step you take brings you closer to your spiritual goals.",
      color: "#3B82F6", // Blue
      emoji: "🌱",
    },
    "occasional-visitor": {
      type: "occasional-visitor",
      title: "Occasional Visitor",
      description: "You're finding your rhythm! We're excited to see you discover your place in the community.",
      color: "#10B981", // Green
      emoji: "🚶",
    },
    "new-member": {
      type: "new-member",
      title: "New Member",
      description: "Welcome to the family! Every great journey starts with a single step, and you've taken yours.",
      color: "#F59E0B", // Amber
      emoji: "✨",
    },
  };

  return personas[type];
}

/**
 * Calculate attendance percentage
 */
export function calculateAttendancePercentage(
  totalAttendance: number,
  totalPossible: number
): number {
  if (totalPossible === 0) return 0;
  return Math.round((totalAttendance / totalPossible) * 100);
}