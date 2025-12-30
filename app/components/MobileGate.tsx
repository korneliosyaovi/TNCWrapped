"use client";

import { useEffect, useState, useRef } from "react";
import DesktopBlocker from "./DesktopBlocker";

interface MobileGateProps {
  children: React.ReactNode;
}

export default function MobileGate({ children }: MobileGateProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    

    const checkIfMobile = () => {
      // Check 1: Touch capability
      const hasTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - some browsers use msMaxTouchPoints
        navigator.msMaxTouchPoints > 0;

      // Check 2: Screen size (mobile is typically <= 768px width)
      const isSmallScreen = window.innerWidth <= 768;

      // Check 3: Pointer type (coarse = touch/finger)
      const hasCoarsePointer = window.matchMedia(
        "(pointer: coarse)"
      ).matches;

      // Check 4: Mobile-specific features
      const isMobileUserAgent = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
        navigator.userAgent
      );

      // Device is considered mobile if it meets at least 2 of these criteria
      const mobileChecks = [
        hasTouch,
        isSmallScreen,
        hasCoarsePointer,
        isMobileUserAgent,
      ];
      const mobileChecksPassed = mobileChecks.filter(Boolean).length;

      // Require at least 2 positive checks for mobile
      const deviceIsMobile = mobileChecksPassed >= 2;

      setIsMobile(deviceIsMobile);
    };

    // Run check on mount
    checkIfMobile();

    // Debounced resize handler
    const handleResize = () => {
      // Clear any pending timeout
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      // Schedule a new check after 200ms
      timeoutRef.current = window.setTimeout(() => {
        checkIfMobile();
        timeoutRef.current = null;
      }, 200);
    };

    // Re-check on window resize (handles orientation changes)
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // Clear any pending timeout to avoid stale calls
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Show nothing during initial check (prevents flash)
  if (isMobile === null) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show desktop blocker if not mobile
  if (!isMobile) {
    return <DesktopBlocker />;
  }

  // Render children (main app) if mobile
  return <>{children}</>;
}