"use client";

import { useEffect } from "react";
import { ScreenProps } from "../ScreenRenderer";
import { useFlow } from "../providers/FlowProvider";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { AnalyticsEvent, ANALYTICS_EVENTS } from "@/app/types";
import { useSFX } from "../audio/SoundEffects";

export default function AttendanceTotalScreen({ onNext }: ScreenProps) {
  const { userData, fetchUserData, isLoading } = useFlow();
  const { trackEvent } = useAnalytics();
  const sfx = useSFX();

  // Track screen view once on mount
  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "attendance_total" },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch user data if needed
  useEffect(() => {
    if (userData.userId && !userData.totalAttendance) {
      fetchUserData(userData.userId);
    }
  }, [userData.userId, userData.totalAttendance, fetchUserData]);
  const handleContinue = () => {
  sfx.play("whoosh");
  
  trackEvent({
    name: ANALYTICS_EVENTS.BUTTON_CLICKED,
        params: { 
        button_name: "keep_going", 
        screen: "attendance_total",
        total_attendance: userData.totalAttendance 
        },
    });
    onNext();
    };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-linear-to-br from-green-900 via-black to-blue-900 flex items-center justify-center p-6">
      <div className="text-center text-white max-w-md">
        {/* Small Label */}
        <p className="text-purple-400 text-sm font-semibold mb-4 uppercase tracking-wider">
          Your Total
        </p>

        {/* Big Number */}
        <div className="mb-6">
          <div className="text-8xl font-bold mb-2 bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {userData.totalAttendance || 0}
          </div>
          <p className="text-2xl text-gray-300 font-light">
            times this year
          </p>
        </div>

        {/* Message */}
        <p className="text-gray-300 mb-8 leading-relaxed">
          You showed up {userData.totalAttendance || 0} times this year. Every time you were here, you made a difference.        </p>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          className="w-full px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-full font-bold text-lg transition-colors"
        >
          Keep Going →
        </button>
      </div>
    </div>
  );
}