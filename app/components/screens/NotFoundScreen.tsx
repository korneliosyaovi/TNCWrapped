"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ScreenProps } from "../ScreenRenderer";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/app/types";
import {
  slideFromRight,
  staggerContainer,
  fadeInUp,
  bounceIn,
  buttonHover,
  buttonTap,
} from "@/app/components/animations/animation";

const SIGNUP_URL = "https://yourchurch.com/signup";

export default function NotFoundScreen({ goToScreen }: ScreenProps) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "not_found" },
    });
  }, [trackEvent]);

  const handleSignUp = () => {
    trackEvent({
      name: ANALYTICS_EVENTS.BUTTON_CLICKED,
      params: { button_name: "sign_up", screen: "not_found" },
    });
    
    window.open(SIGNUP_URL, "_blank", "noopener,noreferrer");  };

  const handleTryAgain = () => {
    trackEvent({
      name: ANALYTICS_EVENTS.BUTTON_CLICKED,
      params: { button_name: "try_again", screen: "not_found" },
    });
    
    goToScreen("before-we-begin");
  };

  return (
    <motion.div
      variants={slideFromRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 h-screen w-full bg-linear-to-br from-orange-900 via-black to-red-900 flex items-center justify-center p-6"
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="text-center text-white max-w-md"
      >
        {/* Icon */}
        <motion.div variants={bounceIn} className="mb-6 text-6xl" role="img" aria-label="Search icon">
          🔍
        </motion.div>
        {/* Title */}
        <motion.h1 variants={fadeInUp} className="text-3xl font-bold mb-4">
          We Couldn't Find You
        </motion.h1>

        {/* Message */}
        <motion.p variants={fadeInUp} className="text-gray-300 mb-8 leading-relaxed">
          It looks like you're not in our system yet. Sign up to start your journey with us and create your year in review next year!
        </motion.p>

        {/* Buttons */}
        <motion.div variants={fadeInUp} className="space-y-3">
          <motion.button
            onClick={handleSignUp}
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="w-full px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Sign Up Now
          </motion.button>

          <motion.button
            onClick={handleTryAgain}
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="w-full px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>

        {/* Note */}
        <motion.p variants={fadeInUp} className="text-gray-500 text-sm mt-8">
          Make sure you're using the same email or phone number you registered with
        </motion.p>
      </motion.div>
    </motion.div>
  );
}