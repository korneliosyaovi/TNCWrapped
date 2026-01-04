"use client";
import { useEffect } from "react";
import { useSFX } from "../audio/SoundEffects";
import { ScreenProps } from "../ScreenRenderer";
import { useFlow } from "../providers/FlowProvider";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/types";
import Background from "@/components/ui/Background";
import ImageChips from "@/components/ui/ImageChips";
import { ArrowLeftIcon } from "@/assets/ArrowLeftIcon";
import { LogoIcon } from "@/assets/LogoIcon";
import VolumeButton from "@/components/ui/VolumeButton";
import { personaImageMap } from "@/types/index";

export default function PersonaScreen({ onBack }: ScreenProps) {
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
    
    // trackEvent({
    //     name: ANALYTICS_EVENTS.BUTTON_CLICKED,
    //     params: { 
    //     button_name: "continue", 
    //     screen: "streak",
    //     longest_streak: userData.longestStreak 
    //     },
    // });
    // onNext();
  };

  const article = userData.persona
  ? /^[AEIOU]/i.test(userData.persona.trim())
    ? "an"
    : "a"
  : "a";

  return (
    <Background
      color="#141414"
      image="/images/Confetti.gif"
    >
      {/* Screen content here */}
      <div className="min-h-screen flex flex-col px-[24px] z-10">
        {/* Header content */}
        <div className="flex items-center justify-between pt-[22px] pb-[18px]">
          <button onClick={onBack}>
            <ArrowLeftIcon color="#FFFFFF" />
          </button>

          <VolumeButton color="#FFFFFF" />
        </div>

        <ImageChips imgSrc={userData.persona ? personaImageMap[userData.persona] : "/images/avatars/Nicodemus.png"} />

        {/* Hero Area*/}
        <div className="text-center">
          <LogoIcon className="mx-auto mb-[8px]" width="34px" height="34px" color="#FFFFFF" />
          <h4 className="text-[#FFFFFF]">You are {article}</h4>
          <h3 className="header gradient-text text-border-light">{userData.persona}</h3>
          <p className="text-[#F1F2F6] text-[12px] mt-[16px] leading-[1.5] tracking-[-0.3px]">
            You attended <strong>{userData.totalAttendance || 0} Services</strong>. Your strongest month was <strong>{userData.highestActivityMonth || ""}</strong>.
            Your longest streak was <strong>{userData.longestStreak || 0} times</strong> in 2025. Every service you attended wasn&apos;t just a check-in. It was a step in your walk with God.
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-between mb-[32px]">
          <button 
            className="self-center mt-[64px] px-[42px] py-[16px] min-w-[166px] rounded-full border-2 border-[#FFFFFF] text-[#FFFFFF]"
            onClick={handleContinue}
          >
            Download
          </button>

          <button
            className="self-center mt-[64px] px-[42px] py-[16px] min-w-[166px] rounded-full bg-[#FFFFFF] text-[#141414]"
            onClick={handleContinue}
          >
            Copy
          </button>
        </div>
      </div>
      
    </Background>
  );
}
