"use client";

import { useEffect } from "react";
import { ScreenProps } from "../ScreenRenderer";
import { useFlow } from "../providers/FlowProvider";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { AnalyticsEvent, ANALYTICS_EVENTS } from "@/types";
import { useSFX } from "../audio/SoundEffects";
import Background from "../ui/Background";
import { ArrowLeftIcon } from "@/assets/ArrowLeftIcon";
import { LogoIcon } from "@/assets/LogoIcon";
import VolumeButton from "@/components/ui/VolumeButton";

export default function AttendanceTotalScreen({ onNext, onBack }: ScreenProps) {
  const { userData, fetchUserData } = useFlow();
  const { trackEvent } = useAnalytics();
  const sfx = useSFX();

  // Track screen view once on mount
  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "attendance_total", id: userData.identity },
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
        id: userData.identity
        },
    });
    onNext();
    };

  return (
    <Background
      color="#141414"
      image="/images/Black-Background-1.svg"
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

        {/* Hero Area*/}
        <div className="mt-[24px] text-center">
          <LogoIcon color="#FFFFFF" className="mx-auto mb-[8px]" style={{ height: "32px", width: "auto" }} />
          <h4 className="text-[#F1F2F6]">You showed up!</h4>
          <h1 className="header gradient-text text-border-light">{userData.totalAttendance || 0}</h1>
          <p className="text-[#F1F2F6] text-[12px] mt-[24px] leading-[1.5] tracking-[-0.3px]">
            You attended services <strong>{userData.totalAttendance || 0}</strong> times this year.
          </p>
        </div>

        {/* Button */}
        <button 
          className="self-center mt-[64px] px-[24px] py-[12px] rounded-full bg-[#FFFFFF] text-[#141414]"
          onClick={handleContinue}
        >
          Keep Going
        </button>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-[12px] items-center px-[8px] pb-[48px] opacity-80">
          <p>
            <span className="text-[#FAFAFA] text-[12px]">That&apos;s top tier dedication</span>
          </p>
          <LogoIcon color="#FAFAFA" />
        </div>
      </div>
      
    </Background>
  );
}