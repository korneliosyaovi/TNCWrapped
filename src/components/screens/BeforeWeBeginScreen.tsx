"use client";

import { useSFX } from "../audio/SoundEffects";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { ScreenProps } from "../ScreenRenderer";
import { useFlow } from "../providers/FlowProvider";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/types";
import Background from "../ui/Background";
import { MailIcon } from '@/assets/MailIcon';

export default function BeforeWeBeginScreen({ goToScreen }: ScreenProps) {
  const { validateUser, isLoading, error, setError, userData, fetchUserData } = useFlow();
  const { trackEvent } = useAnalytics();
  const [input, setInput] = useState("");
  const [localError, setLocalError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const sfx = useSFX();
  const { setUser } = useAnalytics();

  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "before_we_begin" },
    });
  }, [trackEvent]);

  const isValidEmail = (email: string) => {
    // Basic regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

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

    trackEvent({
      name: isValidEmail(input) ? ANALYTICS_EVENTS.EMAIL_SUBMITTED : ANALYTICS_EVENTS.PHONE_SUBMITTED,
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
            validation_method: isValidEmail(input) ? "email" : "phone",
          });
        } catch (err) {
          // Non-fatal: log for diagnostics
          console.error("BeforeWeBeginScreen: setUser failed", err);
        }

        try {
          await fetchUserData(userData.userId);
        } catch (err) {
          // Non-fatal: log and continue to navigation]
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
    // <div className="">
    //     <div></div>
        
    //     {/* Title */}
    //     <h3 className="text-3xl font-bold mb-3">Before We Begin</h3>
        
    //     {/* Subtitle */}
    //     <p className="text-gray-300 mb-8">
    //       Let's find your personalized year in review
    //     </p>

    //     {/* Form */}
    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <div>
    //         <input
    //           type="text"
    //           value={input}
    //           onChange={(e) => setInput(e.target.value)}
    //           placeholder="Enter your email or phone number"
    //           disabled={isLoading}
    //           className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    //         />
    //       </div>

    //       {/* Error Messages */}
    //       {(localError || error) && (
    //         <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
    //           <p className="text-red-400 text-sm">
    //             {localError || error}
    //           </p>
    //         </div>
    //       )}

    //       {/* Submit Button */}
    //       <button
    //         type="submit"
    //         disabled={isLoading}
    //         className=""
    //       >
    //         {isLoading ? (
    //           <>
    //             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
    //             <span>Finding you...</span>
    //           </>
    //         ) : (
    //           <span>Continue</span>
    //         )}
    //       </button>
    //     </form>

    //     {/* Info Note */}
    //     <p className="text-gray-500 text-xs mt-6">
    //       We'll use this to find your personalized stats and memories from this year
    //     </p>
    // </div>

    <Background color="#141414">
      <div className="min-h-screen flex flex-col px-[24px]">
        {/* Header */}
        <div className="mt-[48px] mb-[32px] text-center">
          <Image
            src="/images/Icon-White.png"
            alt="Logo"
            className="mx-auto mb-[16px]"
            width={1000}
            height={1000}
            style={{ height: "32px", width: "auto", maxWidth: "100%" }}
          />
          <h3 className="mb-[16px] text-[28px]">Before We Begin...</h3>
          <p className="text-[#F1F2F6]">
            Enter your details to see your 2025 with TheNew Church.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="space-y-4">
            <div className="relative ">
              <div
                className={`relative flex items-center w-full rounded-[16px] px-[16px] py-[18px] border transition-colors ${
                  // Case 1: blurred with valid email
                  !isFocused && isValidEmail(input)
                    ? "border-transparent bg-[#212020]"
                    : // Case 2: focused or typing
                    isFocused || input
                    ? "border-[#FFFFFF]"
                    : // Case 3: default
                      "border-[#A2A2A2]"
                }`}
              >
                {/* SVG Icon */}
                <MailIcon
                  className={`transition-colors ${(input || isFocused) ? "text-[#FFFFFF]" : "text-[#A2A2A2]"}`}
                />

                {/* Input */}
                <input
                  type="text"
                  name="email"
                  autoComplete="email"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="gracemay@example.com"
                  disabled={isLoading}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="ml-[12px] w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <p className="mt-[18px] text-center">
                <span className="leading-[24px] tracking-[0.024px] border-b-[1.5px] border-white inline-block">
                  Use phone number instead.
                </span>
              </p>
            </div>
          </div>

          {/* Spacer to push button down */}
          <div className="flex-1" />

          {/* Continue Button */}
          <button
            type="submit"
            disabled={!isValidEmail(input) || isLoading} // Disabled if email invalid or loading
            className={`mb-[32px] w-full py-[18px] rounded-full font-medium transition-colors ${
              isValidEmail(input) && !isLoading
                ? "bg-[#FFFFFF] text-[#141414]"
                : "bg-[#212020] text-[#A2A2A2]"
            }`}
          >
            <p>Continue</p>
          </button>
        </form>

        {/* Footer */}
        <div className="mx-auto flex flex-col px-[8px] pb-[32px] space-y-[12px] opacity-80">
          <p className="mb-[12px]">
            <span className="note text-[#FAFAFA]">
              We&apos;ll only use this to personalize your Wrapped.
            </span>
          </p>
          <Image
            src="/images/Icon-White.png"
            alt="Logo"
            className="mx-auto"
            width={1000}
            height={1000}
            style={{ height: "24px", width: "auto", maxWidth: "100%" }}
          />
        </div>
      </div>
    </Background>

  );
}