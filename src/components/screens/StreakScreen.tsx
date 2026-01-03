"use client";
import { useEffect } from "react";
import { useSFX } from "../audio/SoundEffects";
import { ScreenProps } from "../ScreenRenderer";
import { useFlow } from "../providers/FlowProvider";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/types";
import Background from "../ui/Background";
import { ArrowLeftIcon } from "@/assets/ArrowLeftIcon";
import { LogoIcon } from "@/assets/LogoIcon";
import { VolumeIcon } from "@/assets/VolumeIcon";

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
    <Background
      color="#FFFAE9"
      image="/images/Yellow-Background-1.svg"
    >
      {/* Screen content here */}
      <div className="min-h-screen flex flex-col px-[24px]">
        {/* Header content */}
        <div className="flex items-center justify-between pt-[22px] pb-[18px]">
          <button>
            <ArrowLeftIcon color="#141414" />
          </button>

          <button>
            <VolumeIcon color="#141414" />
          </button>
        </div>

        {/* Hero Area*/}
        <div className="mt-[24px] text-center">
          <LogoIcon className="mx-auto mb-[8px]" width="34px" height="34px" color="#141414" />
          <h4 className="text-[#141414]">On Fire for God ! 🔥</h4>
          <h1 className="header gradient-text text-border-dark">{userData.longestStreak || 0}</h1>
          <p className="text-[#141414] text-[12px] mt-[24px] leading-[1.5] tracking-[-0.3px]">
            Your longest streak was <strong>{userData.longestStreak || 0}</strong> times in a row.
          </p>
        </div>

        {/* Button */}
        <button 
          className="self-center mt-[64px] px-[24px] py-[12px] rounded-full bg-[#141414] text-[#FFFFFF]"
          onClick={handleContinue}
        >
          What&apos;s Next?
        </button>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-[12px] items-center px-[8px] pb-[48px] opacity-80">
          <p>
            <span className="text-[#141414] text-[10px]">No gaps. Just presence</span>
          </p>
          <LogoIcon color="#141414" />
        </div>
      </div>
      
    </Background>
  );
}