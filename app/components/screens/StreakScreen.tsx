"use client";
import { useEffect } from "react";
import { useSFX } from "../audio/SoundEffects";
import { ScreenProps } from "../ScreenRenderer";
import { useFlow } from "../providers/FlowProvider";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/app/types";

export default function StreakScreen({ onNext }: ScreenProps) {
  const { userData } = useFlow();
  const { trackEvent } = useAnalytics();
  const sfx = useSFX();

  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "streak" },
    });
  }, [trackEvent]);

  const handleContinue = () => {
    sfx.play("whoosh");
    
    trackEvent({
        name: ANALYTICS_EVENTS.BUTTON_CLICKED,
        params: { 
        button_name: "continue", 
        screen: "streak",
        longest_streak: userData.longestStreak 
        },
    });
    onNext();
    };


  return (
    <div className="h-screen w-full bg-linear-to-br from-orange-900 via-black to-yellow-900 flex items-center justify-center p-6">
      <div className="text-center text-white max-w-md">
        {/* Icon */}
        <div className="mb-6 text-6xl">🔥</div>

        {/* Label */}
        <p className="text-orange-400 text-sm font-semibold mb-4 uppercase tracking-wider">
          Your Longest Streak
        </p>

        {/* Big Number */}
        <div className="mb-6">
          <div className="text-8xl font-bold mb-2 bg-linear-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            {userData.longestStreak || 0}
          </div>
          <p className="text-2xl text-gray-300 font-light">
            weeks in a row
          </p>
        </div>

        {/* Message */}
        <p className="text-gray-300 mb-8 leading-relaxed">
          {userData.longestStreak && userData.longestStreak > 0
            ? `That's ${userData.longestStreak} consecutive weeks of showing up! Consistency is key to growth.`
            : "Start building your streak in 2025!"}
        </p>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          className="w-full px-8 py-4 bg-orange-600 hover:bg-orange-700 rounded-full font-bold text-lg transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}