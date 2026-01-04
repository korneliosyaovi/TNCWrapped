import { PersonaType, UserData } from "@/types";

/**
 * Calculate persona based on attendance percentage
 */
export function calculatePersona(user: UserData): PersonaType {
  const attendance = user.totalAttendance ?? 0;
  const streak = user.longestStreak ?? 0;
  const attendedFeast = user.didAttendFeast === true;
  const attendedOxygen = user.didAttendOxygen === true;
  const attendedNextcon = user.didAttendNxt === true;
  const topMoments = user.favoriteMoments ?? [];

  const hasButterflies = topMoments.includes("Butterflies");
  const hasWhirlwind = topMoments.includes("Whirlwind of Favor");
  const has21DaysFaith = topMoments.includes("21 Days of Faith");
  const hasPANGS = topMoments.includes("PANGS");
  const hasAlagbara = topMoments.includes("Alagbara Release");

  const prayerFocused = hasWhirlwind || has21DaysFaith;
  const worshipFocused = hasPANGS || hasButterflies;
  const teachingFocused = attendedOxygen;
  const influenceFocused = attendedNextcon;

  // 1. Noah — Faithful Anchor
  if (attendance >= 24 && streak >= 15 && attendedFeast) {
    return "Noah";
  }

  // 2. Anna the Prophetess — Watchful Intercessor
  if (streak >= 14 && prayerFocused) {
    return "Anna";
  }

  // 3. Elisha — Hungry Disciple
  if (teachingFocused && attendance >= 15 && streak >= 7) {
    return "Elisha";
  }

  // 4. Esther — Cultural Voice
  if (influenceFocused && hasAlagbara) {
    return "Esther";
  }

  // 5. Gideon — Emerging Leader
  if (influenceFocused && attendance >= 12) {
    return "Gideon";
  }

  // 6. Mary of Bethany — Intimate Worshipper
  if (worshipFocused && attendance >= 10) {
    return "Mary";
  }

  // 7. Mary Magdalene — Transformed Lover
  if (hasButterflies && hasWhirlwind && streak < 7) {
    return "Mary Magdalene";
  }

  // 8. Martha — Faithful Builder
  if (attendance >= 20 && attendedFeast && topMoments.length <= 1) {
    return "Martha";
  }

  // 9. Joseph — Steady Guardian
  if (
    attendance >= 15 &&
    streak >= 10 &&
    !prayerFocused &&
    !worshipFocused &&
    !influenceFocused
  ) {
    return "Joseph";
  }

  // 10. Nicodemus — Seeker (Fallback)
  return "Nicodemus";
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