"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/types";
import Background from "../ui/Background";
import { LogoIcon } from "@/assets/LogoIcon";
import {
  slideFromRight,
  staggerContainer,
  fadeInUp,
  bounceIn,
  buttonHover,
  buttonTap,
} from "@/components/animations/animation";

export default function NotFoundScreen() {
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
    
    const signupUrl = process.env.NEXT_PUBLIC_SIGNUP_URL;

    if (signupUrl) {
      window.open(signupUrl, "_blank", "noopener,noreferrer");
    } else {
      console.error("NEXT_PUBLIC_SIGNUP_URL is not defined");
    }
  };

  return (
    <Background
      color="#FFFAE9"
    >
      {/* Screen content here */}
      <div className="min-h-screen flex flex-col px-[24px] z-10">
        {/* Hero Area*/}
        <div className="mt-[88px] text-center">
          <h4 className="text-[#272727]">User not found</h4>
          <div className="relative inline-block">
            <h2 className="header-shadow">OOPS!</h2>
            <h2 className="header gradient-text text-border-dark">OOPS!</h2>
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
          Join The New
        </button>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between px-[8px] pb-[48px] opacity-80">
          <LogoIcon color="#141414" style={{ height: "36px", width: "auto" }} />
          <p>
            <span className="text-[#141414] text-[14px]">LET&apos;S LOOK BACK TOGETHER.</span>
          </p>
        </div>

      </div>
      
    </Background>
  );
}