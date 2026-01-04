"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ScreenProps } from "../ScreenRenderer";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { useAudio } from "../providers/AudioProvider";
import { useSFX } from "../audio/SoundEffects";
import { ANALYTICS_EVENTS } from "@/types";
import Background from "../ui/Background";
import { LogoIcon } from "@/assets/LogoIcon";
import VolumeButton from "@/components/ui/VolumeButton";
import {
  slideFromRight,
  staggerContainer,
  fadeInUp,
  bounceIn,
  buttonHover,
  buttonTap,
} from "@/components/animations/animation";

export default function WelcomeScreen({ onNext }: ScreenProps) {
  const { trackEvent } = useAnalytics();
  const { playTrack } = useAudio();
  const sfx = useSFX();

  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "welcome" },
    });
  }, [trackEvent]);

  const handleGetStarted = () => {
    // Play click sound
    sfx.play("click");
    
    trackEvent({
      name: ANALYTICS_EVENTS.BUTTON_CLICKED,
      params: { button_name: "get_started", screen: "welcome" },
    });
    
    playTrack("/audio/welcome.mp3");
    
    // Wait for audio delay before transitioning
    setTimeout(() => {
      onNext();
    }, 1000);
  };
  return (
    <Background
      color="#FFFAE9"
    >
      {/* Screen content here */}
      <div className="min-h-screen flex flex-col px-[24px] z-10">
        {/* Header content */}
        <VolumeButton className="ml-auto mt-[22px] mb-[18px]" color="#141414" />

        {/* Hero Area*/}
        <div className="mt-[88px] text-center">
          <h4 className="text-[#272727]">It Started With</h4>
          <div className="relative inline-block">
            <h1 className="header-shadow">GO!</h1>
            <h1 className="header gradient-text text-border-dark">GO!</h1>
          </div>
          <p className="text-[#272727] mt-[48px] leading-[1.5] tracking-[-0.3px]">
            TheNew Church <strong>2025</strong> Wrapped.
          </p>
        </div>

        {/* Button */}
        <button 
          className="black-button self-center mt-[64px] px-[24px] py-[12px] rounded-full text-white"
          onClick={handleGetStarted}
        >
          Let&apos;s Go ➔
        </button>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between px-[8px] pb-[48px] opacity-80">
          <LogoIcon color="#141414" style={{ height: "36px", width: "auto" }} />
          <p>
            <span className="text-[#141414] text-[14px]">LET&apos;S LOOK BACK TOGETHER.</span>
          </p>
        </div>

      </div>
      
    </Background>
  );
}