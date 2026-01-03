"use client";

import { useSFX } from "../audio/SoundEffects";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ScreenProps } from "../ScreenRenderer";
import { useFlow } from "../providers/FlowProvider";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/types";
import Background from "../ui/Background";
import { MailIcon } from "@/assets/MailIcon";
import { ArrowDownIcon } from "@/assets/ArrowDownIcon";

const COUNTRY_CODES = ["+234"];

export default function BeforeWeBeginScreen({ goToScreen }: ScreenProps) {
  const { validateUser, isLoading, error, setError, userData, fetchUserData } =
    useFlow();
  const { trackEvent } = useAnalytics();
  const [input, setInput] = useState("");
  const [localError, setLocalError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sfx = useSFX();
  const { setUser } = useAnalytics();

  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "before_we_begin" },
    });
  }, [trackEvent]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\s/g, "");
    return /^\d{10}$/.test(digits);
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const digits = cleaned.slice(0, 10);

    const len = digits.length;

    if (len === 0) return "";
    if (len <= 3) return digits;
    if (len <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;

    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sfx.play("click");
    setLocalError("");
    setError(null);

    const value = usePhone
      ? countryCode.replace("+", "") + input.replace(/\s/g, "")
      : input;

    if (!value) {
      setLocalError("Please enter your details");
      sfx.play("error");
      return;
    }

    trackEvent({
      name: usePhone
        ? ANALYTICS_EVENTS.PHONE_SUBMITTED
        : ANALYTICS_EVENTS.EMAIL_SUBMITTED,
      params: { screen: "before_we_begin" },
    });

    trackEvent({
      name: ANALYTICS_EVENTS.API_REQUEST_STARTED,
      params: { endpoint: "validate_user", screen: "before_we_begin" },
    });

    const success = await validateUser(value);

    if (success) {
      sfx.play("success");
      trackEvent({
        name: ANALYTICS_EVENTS.API_REQUEST_SUCCESS,
        params: { endpoint: "validate_user" },
      });
      trackEvent({
        name: ANALYTICS_EVENTS.USER_VALIDATION_SUCCESS,
      });

      if (userData?.userId) {
        try {
          await setUser(userData.userId, {
            validation_method: usePhone ? "phone" : "email",
          });
        } catch {}

        try {
          await fetchUserData(userData.userId);
        } catch {}
      }

      goToScreen("attendance-total");
    } else {
      sfx.play("error");
      
      trackEvent({
        name: ANALYTICS_EVENTS.API_REQUEST_FAILED,
        params: { endpoint: "validate_user" },
      });
      trackEvent({
        name: ANALYTICS_EVENTS.USER_NOT_FOUND,
      });

      goToScreen("not-found");
    }
  };

  return (
    <Background color="#141414">
      <div className="min-h-screen flex flex-col px-[24px]">
        <div className="mt-[48px] mb-[32px] text-center">
          <Image
            src="/images/Icon-White.png"
            alt="Logo"
            className="mx-auto mb-[16px]"
            width={1000}
            height={1000}
            style={{ height: "32px", width: "auto", maxWidth: "100%" }}
          />
          <h4 className="mb-[16px] text-[28px]">Before We Begin...</h4>
          <p className="text-[#F1F2F6]">
            Enter your details to see your 2025 with TheNew Church.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="space-y-4">
            {usePhone ? (
              // <div className="relative flex items-center w-full rounded-[16px] px-[16px] py-[18px] border border-[#FFFFFF]">
              <div
                className={`relative flex items-center w-full rounded-[16px] px-[16px] py-[18px] border transition-colors ${
                  !isFocused && isValidPhone(input)
                    ? "border-transparent bg-[#212020]"
                    : isFocused || input
                    ? "border-[#FFFFFF]"
                    : "border-[#A2A2A2]"
                }`}
              >
                {/* Custom Country Dropdown */}
                <div ref={dropdownRef}  className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDropdown((s) => !s)}
                    className="flex gap-[8px] items-center text-white bg-transparent appearance-none"
                  >
                    <span>{countryCode}</span>
                    <ArrowDownIcon className="ml-2 text-[#A2A2A2]" />
                  </button>

                  {showDropdown && (
                    <div className="absolute z-10 mt-2 min-w-[64px] bg-[#1A1A1A] border border-[#FFFFFF] rounded-[8px]">
                      {COUNTRY_CODES.map((c) => (
                        <div
                          key={c}
                          onClick={() => {
                            setCountryCode(c);
                            setShowDropdown(false);
                          }}
                          className="px-[8px] py-[4px] text-white hover:bg-[#333333] cursor-pointer rounded-[8px]"
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="tel"
                  inputMode="numeric"
                  name="phone"
                  autoComplete="tel"
                  value={input}
                  onChange={(e) => setInput(formatPhone(e.target.value))}
                  placeholder="801 234 5678"
                  disabled={isLoading}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="ml-[12px] w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
            ) : (
              <div
                className={`relative flex items-center w-full rounded-[16px] px-[16px] py-[18px] border transition-colors ${
                  !isFocused && isValidEmail(input)
                    ? "border-transparent bg-[#212020]"
                    : isFocused || input
                    ? "border-[#FFFFFF]"
                    : "border-[#A2A2A2]"
                }`}
              >
                <MailIcon
                  className={`transition-colors ${
                    input || isFocused ? "text-[#FFFFFF]" : "text-[#A2A2A2]"
                  }`}
                />
                <input
                  type="text"
                  name="email"
                  autoComplete="email"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="gracemay@example.com"
                  disabled={isLoading}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="ml-[12px] w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
            )}

            <p className="mt-[18px] text-center">
              <span
                className="leading-[24px] tracking-[0.024px] border-b-[1.5px] border-white inline-block cursor-pointer"
                onClick={() => {
                  setUsePhone(!usePhone);
                  setInput("");
                }}
              >
                {usePhone
                  ? "Use email address instead"
                  : "Use phone number instead"}
              </span>
            </p>
          </div>

          <div className="flex-1" />

          <button
            type="submit"
            disabled={
              usePhone ? !isValidPhone(input) || isLoading : !isValidEmail(input) || isLoading
            }
            className={`mb-[32px] w-full py-[18px] rounded-full font-medium transition-colors ${
              (usePhone ? isValidPhone(input) : isValidEmail(input)) && !isLoading
                ? "bg-[#FFFFFF] text-[#141414]"
                : "bg-[#212020] text-[#A2A2A2]"
            }`}
          >
            <p>Continue</p>
          </button>
        </form>

        <div className="mx-auto flex flex-col px-[8px] pb-[32px] space-y-[12px] opacity-80">
          <p className="mb-[12px]">
            <span className="note text-[#FAFAFA]">
              We&apos;ll only use this to personalize your Wrapped.
            </span>
          </p>
          <Image
            src="/images/Icon-White.png"
            alt="Logo"
            className="mx-auto"
            width={1000}
            height={1000}
            style={{ height: "24px", width: "auto", maxWidth: "100%" }}
          />
        </div>
      </div>
    </Background>
  );
}
