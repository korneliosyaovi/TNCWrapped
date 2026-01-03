"use client";

import MobileGate from "../components/MobileGate";
import ScreenRenderer from "../components/ScreenRenderer";
// import DebugDashboard from "./components/debug/DebugDashboard";
import AudioManager from "../components/audio/AudioManager";
import MuteButton from "../components/audio/MuteButton";
import SoundEffectsProvider from "../components/audio/SoundEffects";

function AppContent() {
  return (
    <>
      {/* Audio System */}
      <AudioManager />
      <SoundEffectsProvider />
      <MuteButton />
      
      {/* Debug Dashboard - only rendered in non-production builds */}
      {/* {process.env.NODE_ENV !== 'production' && <DebugDashboard />} */}
      
      {/* Main Screen Renderer */}
      <ScreenRenderer />
    </>
  );
}

export default function Home() {
  return (
    <MobileGate>
      <AppContent />
    </MobileGate>
  );
}
