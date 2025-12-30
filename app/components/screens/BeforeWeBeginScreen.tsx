"use client";

import { useSFX } from "../audio/SoundEffects";
import { useEffect, useState } from "react";
import { ScreenProps } from "../ScreenRenderer";
import { useFlow } from "../providers/FlowProvider";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/app/types";

export default function BeforeWeBeginScreen({ goToScreen }: ScreenProps) {
  const { validateUser, isLoading, error, setError, userData, fetchUserData } = useFlow();
  const { trackEvent } = useAnalytics();
  const [input, setInput] = useState("");
  const [localError, setLocalError] = useState("");
  const sfx = useSFX();
  const { setUser } = useAnalytics();

  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "before_we_begin" },
    });
  }, [trackEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Play click sound
  sfx.play("click");
  
  setLocalError("");
  setError(null);

  if (!input.trim()) {
    setLocalError("Please enter your email or phone number");
    sfx.play("error"); // Error sound
    return;
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
  trackEvent({
    name: isEmail ? ANALYTICS_EVENTS.EMAIL_SUBMITTED : ANALYTICS_EVENTS.PHONE_SUBMITTED,
    params: { screen: "before_we_begin" },
  });
  trackEvent({
    name: ANALYTICS_EVENTS.API_REQUEST_STARTED,
    params: { endpoint: "validate_user", screen: "before_we_begin" },
  });

  const success = await validateUser(input);

  if (success) {
    // Play success sound
    sfx.play("success");
    
    trackEvent({
      name: ANALYTICS_EVENTS.API_REQUEST_SUCCESS,
      params: { endpoint: "validate_user" },
    });
    trackEvent({
      name: ANALYTICS_EVENTS.USER_VALIDATION_SUCCESS,
    });

    // Set user in analytics and fetch additional user data if available.
    if (userData?.userId) {
      try {
        await setUser(userData.userId, {
          validation_method: isEmail ? "email" : "phone",
        });
      } catch (err) {
        // Non-fatal: log for diagnostics
        // eslint-disable-next-line no-console
        console.error("BeforeWeBeginScreen: setUser failed", err);
      }

      try {
        await fetchUserData(userData.userId);
      } catch (err) {
        // Non-fatal: log and continue to navigation
        // eslint-disable-next-line no-console
        console.error("BeforeWeBeginScreen: fetchUserData failed", err);
      }
    }

    // Navigate to attendance total regardless of fetch outcome
    goToScreen("attendance-total");
  } else {
    // Play error sound
    sfx.play("error");
    
    trackEvent({
      name: ANALYTICS_EVENTS.API_REQUEST_FAILED,
      params: { endpoint: "validate_user" },
    });
    trackEvent({
      name: ANALYTICS_EVENTS.USER_NOT_FOUND,
    });

    goToScreen("not-found");
  }
};

  return (
    <div className="h-screen w-full bg-linear-to-br from-blue-900 via-black to-purple-900 flex items-center justify-center p-6">
      <div className="text-center text-white max-w-md w-full">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-3">Before We Begin</h1>
        
        {/* Subtitle */}
        <p className="text-gray-300 mb-8">
          Let's find your personalized year in review
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your email or phone number"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Error Messages */}
          {(localError || error) && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">
                {localError || error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full font-bold text-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Finding you...</span>
              </>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </form>

        {/* Info Note */}
        <p className="text-gray-500 text-xs mt-6">
          We'll use this to find your personalized stats and memories from this year
        </p>
      </div>
    </div>
  );
}