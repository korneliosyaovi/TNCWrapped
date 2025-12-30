import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AppProviders from "./components/providers/AppProviders";

export const metadata: Metadata = {
  title: "Mobile Flow App",
  description: "A mobile-only, state-driven experience",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    // Allow users to zoom for accessibility. Do not disable pinch-to-zoom.
    userScalable: true,
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Google Analytics 4 */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    debug_mode: ${process.env.NEXT_PUBLIC_GA4_DEBUG === "true"},
                    send_page_view: false
                  });
                `,
            }}
          />
        </>
      )}
      <body suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}