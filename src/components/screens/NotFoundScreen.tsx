"use client";

import { useEffect } from "react";
import Image from 'next/image';
import { motion } from "framer-motion";
import { ScreenProps } from "../ScreenRenderer";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/types";
import Background from "../ui/Background";
import {
  slideFromRight,
  staggerContainer,
  fadeInUp,
  bounceIn,
  buttonHover,
  buttonTap,
} from "@/components/animations/animation";

const SIGNUP_URL = "https://yourchurch.com/signup";

export default function NotFoundScreen({ goToScreen }: ScreenProps) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "not_found" },
    });
  }, [trackEvent]);

  const handleJoinNow = () => {
    trackEvent({
      name: ANALYTICS_EVENTS.BUTTON_CLICKED,
      params: { button_name: "join_now", screen: "not_found" },
    });
    
    window.open(SIGNUP_URL, "_blank", "noopener,noreferrer");
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
            <Image
              src="/images/arrow.svg"
              alt="back arrow icon"
              width={1000}
              height={1000}
              style={{
                height: "24px",
                width: "auto",
                maxWidth: "100%",
              }}
            />
          </button>

          <button>
            <Image
              src="/images/volume.svg"
              alt="volume icon"
              width={1000}
              height={1000}
              style={{
                height: "24px",
                width: "auto",
                maxWidth: "100%",
              }}
            />
          </button>
        </div>

        {/* Hero Area*/}
        <div className="mt-[88px] text-center">
          <h3 className="text-[#272727]">User not found</h3>
          <div className="relative inline-block">
            <h2 className="header-shadow">OOPS!</h2>
            <h2 className="header gradient-text text-border">OOPS!</h2>
          </div>
          <p className="text-[#272727] mt-[48px] leading-[1.5] tracking-[-0.3px]">
            We have secured the <strong>ninety-nine</strong>, but the profile you are searching for has wandered off.
          </p>
        </div>

        {/* Button */}
        <button 
          className="black-button self-center mt-[64px] px-[24px] py-[12px] rounded-full text-white"
          onClick={handleJoinNow}
        >
          Join the New
        </button>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between px-[8px] pb-[48px]">
          <Image
            src="/images/Icon-Black.png"
            alt="Logo"
            width={1000}
            height={1000}
            style={{
              height: "36px",
              width: "auto",
              maxWidth: "100%",
            }}
          />
          <p>
            <span className="text-[#272727] text-[14px]">LET&apos;S LOOK BACK TOGETHER.</span>
          </p>
        </div>

      </div>
      
    </Background>
  );
}