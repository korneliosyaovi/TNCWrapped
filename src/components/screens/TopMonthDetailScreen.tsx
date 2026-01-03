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

export default function TopMonthDetailScreen({ onNext }: ScreenProps) {
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
      color="#141414"
      image="/images/Circle.gif"
    >
      {/* Screen content here */}
      <div className="min-h-screen flex flex-col px-[24px]">
        {/* Header content */}
        <div className="flex items-center justify-between pt-[22px] pb-[18px]">
          <button>
            <ArrowLeftIcon color="#FFFFFF" />
          </button>

          <button>
            <VolumeIcon color="#FFFFFF" />
          </button>
        </div>

        {/* Hero Area*/}
        <div className="mt-[88px] text-center">
          <LogoIcon className="mx-auto mb-[8px]" width="34px" height="34px" color="#FFFFFF" />
          <h4 className="text-[#FFFFFF]">This Month Hit Different</h4>
          <h3 className="header gradient-text text-border-light">{userData.highestActivityMonth || ""}</h3>
          <p className="text-[#FFFFFF] text-[12px] mt-[16px] leading-[1.5] tracking-[-0.3px]">
            Your Strongest Month was <strong>{userData.highestActivityMonth || ""}</strong>
          </p>
        </div>

        {/* Button */}
        <button 
          className="self-center mt-[64px] px-[24px] py-[12px] rounded-full bg-[#FFFFFF] text-[#141414]"
          onClick={handleContinue}
        >
          Continue the Journey
        </button>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-[12px] items-center px-[8px] pb-[48px] opacity-80">
          <p>
            <span className="text-[#FAFAFA] text-[10px]">Were you there?</span>
          </p>
          <LogoIcon color="#FAFAFA" />
        </div>
      </div>
      
    </Background>
  );
}