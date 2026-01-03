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
import TopMonthIntroScreen from "./screens/TopMonthIntroScreen";
import TopMonthDetailScreen from "./screens/TopMonthDetailScreen";
import FeastShofarScreen from "./screens/FeastShofarScreen";
import OxygenScreen from "./screens/OxygenScreen";
import NxtConferenceScreen from "./screens/NxtConferenceScreen";
import FavoriteMomentsScreen from "./screens/FavoriteMomentsScreen";
import PersonaScreen from "./screens/PersonaScreen";

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
          <TopMonthIntroScreen key="top-month-intro" {...screenProps} />
        )}
        
        {currentScreen === "top-month-detail" && (
          <TopMonthDetailScreen key="top-month-detail" {...screenProps} />
        )}
        
        {currentScreen === "feast-shofar" && (
          <FeastShofarScreen key="feast-shofar" {...screenProps} />
        )}
        
        {currentScreen === "oxygen" && (
          <OxygenScreen key="oxygen" {...screenProps} />
        )}
        
        {currentScreen === "nxt-conference" && (
          <NxtConferenceScreen key="nxt-conference" {...screenProps} />
        )}
        
        {currentScreen === "favorite-moments" && (
          <FavoriteMomentsScreen key="favorite-moments" {...screenProps} />
        )}
        
        {currentScreen === "persona" && (
          <PersonaScreen key="persona" {...screenProps} />
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
