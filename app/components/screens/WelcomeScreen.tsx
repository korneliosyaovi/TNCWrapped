"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ScreenProps } from "../ScreenRenderer";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { useAudio } from "../providers/AudioProvider";
import { useSFX } from "../audio/SoundEffects";
import { ANALYTICS_EVENTS } from "@/app/types";
import Background from "../ui/Background";
import {
  slideFromRight,
  staggerContainer,
  fadeInUp,
  bounceIn,
  buttonHover,
  buttonTap,
} from "../animations/animation";

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
      <div className="min-h-screen flex flex-col px-[24px]">
        {/* Header content */}
        <div className="flex items-center justify-between pt-[22px] pb-[18px]">
          <button>
            <img src="/images/arrow.svg" alt="Logo" className="" />
          </button>

          <button>
            <img src="/images/volume.svg" alt="Logo" className="" />
          </button>
        </div>

        {/* Hero Area*/}
        <div className="mt-[88px] text-center">
          <h3 className="text-[#272727]">It Started With</h3>
          <h1 className="gradient-text text-border">GO!</h1>
          <p className="text-[#272727] mt-[64px]">TheNew Church <span className="bold">2025</span> Wrapped.</p>
        </div>

        {/* Button */}
        <button className="black-button self-center w-[128px] mt-[64px] px-[24px] py-[12px] rounded-full text-white">
          Let's Go
        </button>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between px-[8px] pb-[48px]">
          <img src="/images/Icon-Black.png" alt="Logo" className="h-[36px] w-auto" />
          <p>
            <span className="text-[#272727] text-[14px]">LET'S LOOK BACK TOGETHER.</span>
          </p>
        </div>

      </div>
      
    </Background>
  );
}