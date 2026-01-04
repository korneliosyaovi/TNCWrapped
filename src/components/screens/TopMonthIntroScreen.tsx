"use client";
import { useCallback, useEffect, useRef } from "react";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ScreenProps } from "../ScreenRenderer";
import { ANALYTICS_EVENTS } from "@/types";
import Background from "../ui/Background";
import { ArrowLeftIcon } from "@/assets/ArrowLeftIcon";
import { LogoIcon } from "@/assets/LogoIcon";
import { VolumeIcon } from "@/assets/VolumeIcon";

export default function TopMonthIntroScreen({ onNext, onBack }: ScreenProps) {
  const { trackEvent } = useAnalytics();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lockedRef = useRef(false);

  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "streak" },
    });
  }, [trackEvent]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (!lockedRef.current) {
        lockedRef.current = true;
        onNext();
      }
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onNext]);

  const handleBack = useCallback(() => {
    lockedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onBack();
  }, [onBack]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const rowStarts = [0, 2, 4, 6, 8, 10];

  return (
    <Background
      color="#141414"
      image="/images/Black-Background-2.svg"
    >
      {/* Screen content here */}
      <div className="min-h-screen flex flex-col px-[24px] z-10">
        {/* Header content */}
        <div className="flex items-center justify-between pt-[22px] pb-[18px]">
          <button onClick={handleBack}>
            <ArrowLeftIcon color="#FFFFFF" />
          </button>

          <button>
            <VolumeIcon color="#FFFFFF" />
          </button>
        </div>

        {/* Hero Area*/}
        <div className="mt-[24px] text-center">
          <LogoIcon className="mx-auto mb-[8px]" width="34px" height="34px" color="#FFFFFF" />
          <h4 className="text-[#FFFFFF]">This Month Hit Different</h4>
          
          <div className="space-y-3 mt-[32px]">
            {rowStarts.map((startIndex, rowIndex) => {
              // Rotate months so each row starts at a different month
              const rotated = [
                ...months.slice(startIndex),
                ...months.slice(0, startIndex),
              ];

              // Duplicate for seamless scrolling
              const scrollingMonths = [...rotated, ...rotated];

              return (
                <div
                  key={rowIndex}
                  className="relative overflow-hidden whitespace-nowrap mt-[16px]"
                >
                  <div
                    className={`inline-flex gap-[16px] tracking-[-0.3px]
                      ${rowIndex % 2 === 0 ? "animate-scroll-left" : "animate-scroll-right"}`}
                  >
                    {scrollingMonths.map((month, i) => (
                      <span key={i} className="text-[16px] text-[#FEF1C0] leading-[32px]">
                        {month}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Animations */}
          <style jsx>{`
            @keyframes scroll-left {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }

            @keyframes scroll-right {
              from {
                transform: translateX(-50%);
              }
              to {
                transform: translateX(0);
              }
            }

            .animate-scroll-left {
              animation: scroll-left 18s linear infinite;
            }

            .animate-scroll-right {
              animation: scroll-right 18s linear infinite;
            }
          `}</style>
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-[12px] items-center px-[8px] pb-[48px] opacity-80">
          <p>
            <span className="text-[#FAFAFA] text-[12px]">Were you there?</span>
          </p>
          <LogoIcon color="#FAFAFA" />
        </div>
      </div>
      
    </Background>
  );
}