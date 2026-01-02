/**
 * Google Analytics 4 Integration
 * Handles all GA4 event tracking
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "";
export const GA_DEBUG = process.env.NEXT_PUBLIC_GA4_DEBUG === "true";

// Type definitions for gtag
declare global {
  interface Window {
    gtag?: {
      (command: "js", date: Date | number): void;
      (command: "config", measurementId: string, config?: Record<string, any>): void;
      (command: "event", eventName: string, params?: Record<string, any>): void;
      (command: "set", name: string | Record<string, any>, value?: any): void;
    };
    dataLayer?: any[];
  }
}

/**
 * Initialize gtag
 */
export function initGtag() {
  if (typeof window === 'undefined') {
    return;
  }

  if (!GA_MEASUREMENT_ID) {
    console.warn("GA4 Measurement ID not set");
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    debug_mode: GA_DEBUG,
    send_page_view: false, // We're not using pageviews, only events
  });

  if (GA_DEBUG) {
    console.log("GA4 initialized in debug mode:", GA_MEASUREMENT_ID);
  }
}
/**
 * Track a custom event
 *
 * NOTE: `eventParams` may contain PII (email, phone, user IDs). Sanitize or redact
 * sensitive fields before calling this function. This function is SSR-safe and will
 * return early when not running in a browser.
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window === "undefined") {
    console.warn("GA4 not initialized (server)");
    return;
  }

  if (!window.gtag) {
    console.warn("GA4 not initialized");
    return;
  }

  window.gtag("event", eventName, eventParams);

  if (GA_DEBUG) {
    console.log("GA4 Event:", eventName, eventParams);
  }
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window === "undefined") {
    console.warn("GA4 not initialized (server)");
    return;
  }

  if (!window.gtag) {
    console.warn("GA4 not initialized");
    return;
  }

  window.gtag("set", "user_properties", properties);

  if (GA_DEBUG) {
    console.log("GA4 User Properties:", properties);
  }
}

/**
 * Track exceptions/errors
 */
export function trackException(description: string, fatal: boolean = false) {
  trackEvent("exception", {
    description,
    fatal,
  });
}