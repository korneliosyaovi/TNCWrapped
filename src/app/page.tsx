"use client";

import MobileGate from "../components/MobileGate";
import AudioGate from "../components/AudioGate";
import ScreenRenderer from "../components/ScreenRenderer";

export default function Home() {
  return (
    <MobileGate>
      <AudioGate>
        <ScreenRenderer />
      </AudioGate>
    </MobileGate>
  );
}
