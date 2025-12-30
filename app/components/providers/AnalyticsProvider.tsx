"use client";

import React, { createContext, useContext, useEffect } from "react";
import { AnalyticsEvent } from "@/app/types";
import { initGtag, trackEvent as gtag_trackEvent, setUserProperties } from "@/app/lib/gtag";

interface AnalyticsContextType {
  trackEvent: (event: AnalyticsEvent) => void;
  setUser: (userId: string, properties?: Record<string, any>) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize GA4 on mount
    initGtag();
  }, []);

  const isDev = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_API_DEBUG === "true";

  const trackEvent = (event: AnalyticsEvent) => {
    // Dev-only log
    if (isDev) console.log("📊 Analytics Event:", event.name, event.params);

    // Send to GA4, but don't let tracking errors break the app
    try {
      gtag_trackEvent(event.name, event.params);
    } catch (err) {
      if (isDev) console.error("Analytics error:", err);
    }
  };

  const setUser = async (userId: string, properties?: Record<string, any>) => {
    try {
      const hashed = await hashUserId(userId);

      const userProperties = {
        user_id_hash: hashed,
        ...properties,
      };

      setUserProperties(userProperties);
      if (isDev) console.log("👤 User Properties Set:", userProperties);    } catch (err) {
      console.error("Failed to set user properties:", err);
    }
  };

  const value: AnalyticsContextType = {
    trackEvent,
    setUser,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}

/**
 * Simple hash function for user IDs (for privacy)
 * In production, use a proper hashing algorithm
 */
async function hashUserId(userId: string): Promise<string> {
  // Use Web Crypto API for a secure SHA-256 hash and return hex-encoded string
  try {
    const subtle = (globalThis as any).crypto?.subtle;
    if (!subtle || typeof subtle.digest !== "function") {
      console.warn("Web Crypto Subtle API not available — cannot securely hash user id");
      // Fallback (non-cryptographic) - prefix to make clear it's a fallback
      // Fallback (non-cryptographic) - prefix to make clear it's a fallback
      // Use encodeURIComponent to safely handle unicode, then hash-like transform
      const safeId = encodeURIComponent(userId).slice(0, 16);
      return `sha256_unavailable_${safeId.length}`;
    }    const encoder = new TextEncoder();
    const data = encoder.encode(userId);
    const hashBuffer = await subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return `sha256_${hashHex}`;
  } catch (error) {
    console.error("hashUserId error:", error);
    return `sha256_error`;
  }
}