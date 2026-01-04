"use client";
import { useEffect } from "react";
import Image from "next/image";
import { useSFX } from "../audio/SoundEffects";
import { ScreenProps } from "../ScreenRenderer";
import { useFlow } from "../providers/FlowProvider";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/types";
import Background from "../ui/Background";
import { ArrowLeftIcon } from "@/assets/ArrowLeftIcon";
import { LogoIcon } from "@/assets/LogoIcon";
import { VolumeIcon } from "@/assets/VolumeIcon";

export default function PersonaScreen({ onNext, onBack }: ScreenProps) {
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
      image="/images/Confetti.gif"
    >
      <div className="relative w-full h-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <div className="absolute -top-[58px] w-[130px] h-[130px] rounded-full border-[2px] border-[#FFFFFF] bg-[#000000]" />
          <div className="absolute -top-[36px] w-[130px] h-[130px] rounded-full border-[2px] border-[#FFFFFF] bg-[#000000]" />
          <div className="relative -top-[21px] w-[130px] h-[130px] rounded-full border-[2px] border-[#FFFFFF] overflow-hidden">
            <Image
              src="/images/Nicodemus.png"
              alt="persona"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Screen content here */}
      <div className="min-h-screen flex flex-col px-[24px]">
        {/* Header content */}
        <div className="flex items-center justify-between pt-[22px] pb-[18px]">
          <button onClick={onBack}>
            <ArrowLeftIcon color="#FFFFFF" />
          </button>

          <button>
            <VolumeIcon color="#FFFFFF" />
          </button>
        </div>

        {/* Spacer to push contents down */}
        <div className="flex-1" />

        {/* Hero Area*/}
        <div className="mt-[88px] text-center">
          <LogoIcon className="mx-auto mb-[8px]" width="34px" height="34px" color="#FFFFFF" />
          <h4 className="text-[#FFFFFF]">You are a</h4>
          <h3 className="header gradient-text text-border-light">{userData.persona || "Nicodemus"}</h3>
          <p className="text-[#F1F2F6] text-[12px] mt-[16px] leading-[1.5] tracking-[-0.3px]">
            You attended <strong>{userData.totalAttendance || 0} Services</strong>. Your strongest month was <strong>{userData.highestActivityMonth || ""}</strong>.
            You dominated <strong>Gethsemane, {userData.longestStreak || 0} times</strong>. Every service you attended wasn&apos;t just a check-in. It was a step in your walk with God.
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