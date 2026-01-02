"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useFlow } from "./providers/FlowProvider";

import { ScreenId } from "@/types";

import { slideFromRight, fadeInUp, staggerContainer } from "./animations/animation";

// Import screen components
import WelcomeScreen from "./screens/WelcomeScreen";
import BeforeWeBeginScreen from "./screens/BeforeWeBeginScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import AttendanceTotalScreen from "./screens/AttendanceTotalScreen";
import StreakScreen from "./screens/StreakScreen";

export interface ScreenProps {
  onNext: () => void;
  onBack: () => void;
  goToScreen: (screenId: ScreenId) => void;
}

export default function ScreenRenderer() {
  const { currentScreen, nextScreen, previousScreen, goToScreen } = useFlow();

  const screenProps: ScreenProps = {
    onNext: nextScreen,
    onBack: previousScreen,
    goToScreen,
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {currentScreen === "welcome" && (
          <WelcomeScreen key="welcome" {...screenProps} />
        )}
        
        {currentScreen === "before-we-begin" && (
          <BeforeWeBeginScreen key="before-we-begin" {...screenProps} />
        )}
        
        {currentScreen === "not-found" && (
          <NotFoundScreen key="not-found" {...screenProps} />
        )}
        
        {currentScreen === "attendance-total" && (
          <AttendanceTotalScreen key="attendance-total" {...screenProps} />
        )}
        
        {currentScreen === "streak" && (
          <StreakScreen key="streak" {...screenProps} />
        )}
        
        {currentScreen === "top-month-intro" && (
          <PlaceholderScreen key="top-month-intro" name="Top Month Intro" {...screenProps} />
        )}
        
        {currentScreen === "top-month-detail" && (
          <PlaceholderScreen key="top-month-detail" name="Top Month Detail" {...screenProps} />
        )}
        
        {currentScreen === "feast-shofar" && (
          <PlaceholderScreen key="feast-shofar" name="Feast-Shofar" {...screenProps} />
        )}
        
        {currentScreen === "oxygen" && (
          <PlaceholderScreen key="oxygen" name="Oxygen" {...screenProps} />
        )}
        
        {currentScreen === "nxt-conference" && (
          <PlaceholderScreen key="nxt-conference" name="NXT Conference" {...screenProps} />
        )}
        
        {currentScreen === "favorite-moments" && (
          <PlaceholderScreen key="favorite-moments" name="Favorite Moments" {...screenProps} />
        )}
        
        {currentScreen === "persona" && (
          <PlaceholderScreen key="persona" name="Persona" {...screenProps} />
        )}

        {/* Fallback for any unrecognized screen id to avoid empty UI */}
        {![
          "welcome",
          "before-we-begin",
          "not-found",
          "attendance-total",
          "streak",
          "top-month-intro",
          "top-month-detail",
          "feast-shofar",
          "oxygen",
          "nxt-conference",
          "favorite-moments",
          "persona",
        ].includes(currentScreen) && (
          <NotFoundScreen key="not-found" {...screenProps} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PlaceholderScreen({ name, onNext, onBack }: ScreenProps & { name: string }) {
  
  return (
    <motion.div
      variants={slideFromRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 h-screen w-full bg-linear-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6"
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="text-center text-white max-w-md"
      >
        <motion.div variants={fadeInUp} className="mb-6 text-6xl">
          🚧
        </motion.div>
        <motion.h1 variants={fadeInUp} className="text-2xl font-bold mb-2">
          {name}
        </motion.h1>
        <motion.p variants={fadeInUp} className="text-gray-400 mb-8 text-sm">
          This screen will be implemented soon
        </motion.p>
        <motion.div variants={fadeInUp} className="flex gap-3 justify-center">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-colors"
          >
            ← Back
          </motion.button>
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-colors"
          >
            Next →
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}