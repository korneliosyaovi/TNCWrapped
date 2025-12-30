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
      <div className="w-4/5 mx-auto text-center pt-[88px]">
        <h3 className="text-[#272727]">It Started With</h3>
        <h1 className="gradient-text text-border mb-[64px]">GO!</h1>
        <p className="text-[#272727]">TheNew Church <span className="bold">2025</span> Wrapped.</p>

        
        <div className="">
          <p>
            <span className="note text-[#272727]">Let's look back together.</span>
          </p>
          <img src="/images/Icon-Black.png" alt="Logo" className="mx-auto h-[24px] w-auto" />
        </div>
      </div>
    </Background>
  );
}