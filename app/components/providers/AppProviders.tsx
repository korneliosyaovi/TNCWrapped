"use client";

import type { ReactNode } from "react";
import { FlowProvider } from "./FlowProvider";
import { AudioProvider } from "./AudioProvider";
import { AnalyticsProvider } from "./AnalyticsProvider";

export default function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AnalyticsProvider>
      <AudioProvider>
        <FlowProvider>{children}</FlowProvider>
      </AudioProvider>
    </AnalyticsProvider>
  );
}