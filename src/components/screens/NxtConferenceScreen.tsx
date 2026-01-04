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

export default function NxtConferenceScreen({ onNext, onBack }: ScreenProps) {
  const { setEventAttendance } = useFlow();
  const { trackEvent } = useAnalytics();
  const sfx = useSFX();

  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "nxt-conference" },
    });
  }, [trackEvent]);

  const handleAnswer = (attended: boolean) => {
    sfx.play("whoosh");

    setEventAttendance("nxt", attended);

    trackEvent({
      name: ANALYTICS_EVENTS.BUTTON_CLICKED,
      params: {
        button_name: attended ? "attended" : "missed",
        screen: "nxt-conference",
      },
    });

    onNext();
  };


  return (
    <Background
      color="#FFFAE9"
    >
      {/* Screen content here */}
      <div className="min-h-screen flex flex-col px-[24px]">
        {/* Header content */}
        <div className="flex items-center justify-between pt-[22px] pb-[18px]">
          <button onClick={onBack}>
            <ArrowLeftIcon color="#141414" />
          </button>

          <button>
            <VolumeIcon color="#141414" />
          </button>
        </div>

        {/* Hero Area*/}
        <div className="mt-[24px] text-center">
          <h4 className="text-[#141414]">Were you there?</h4>
          <div className="border-[1.5px] border-[#141414] rounded-[52px] mt-[24px] p-[12px]">
            <div className="relative max-w-[320px] max-h-[284px] w-full h-[284px] rounded-[38px] overflow-hidden mx-auto">
              <Image
                src="/images/NXTCON.jpg"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>

            <p className="text-[#141414] my-[24px] text-[20px] font-[500]">
              NXTCON Acts 12
            </p>
          </div>
        </div>

        {/* Spacer to push buttons down */}
        <div className="flex-1" />

        {/* Button */}
        <div className="flex justify-between">
          <button 
            className="self-center mt-[64px] px-[42px] py-[16px] rounded-full bg-[#141414] text-[#FFFFFF]"
            onClick={() => handleAnswer(true)}
          >
            Absolutely!
          </button>

          <button 
            className="self-center mt-[64px] px-[42px] py-[16px] rounded-full border-2 border-[#141414] text-[#141414]"
            onClick={() => handleAnswer(false)}
          >
            I missed it
          </button>
        </div>

        {/* Footer */}
        <div className="mt-[12px] flex flex-col gap-[12px] items-center px-[8px] pb-[32px] opacity-80">
          <p className="mt-[12px]">
            <span className="text-[#141414] text-[10px]">Big Moments</span>
          </p>
          <LogoIcon color="#141414" />
        </div>
      </div>
      
    </Background>
  );
}