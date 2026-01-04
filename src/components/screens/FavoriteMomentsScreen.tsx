"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSFX } from "../audio/SoundEffects";
import { ScreenProps } from "../ScreenRenderer";
import { useFlow } from "../providers/FlowProvider";
import { useAnalytics } from "../providers/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/types";
import Background from "../ui/Background";
import { ArrowLeftIcon } from "@/assets/ArrowLeftIcon";
import { LogoIcon } from "@/assets/LogoIcon";
import { VolumeIcon } from "@/assets/VolumeIcon";

const items = [
  { id: 1, image: "/images/Butterflies-V.webp", text: "Butterflies V - Glass House" },
  { id: 2, image: "/images/Whirlwind-of-Favour.jpg", text: "Whirlwind of Favour" },
  { id: 3, image: "/images/21-Days-of-Faith.jpg", text: "21 Days of Faith" },
  { id: 4, image: "/images/PANGS.jpg", text: "PANGS" },
  { id: 5, image: "/images/Alagbara.jpg", text: "Alagbara Release" },
];

export default function FavoriteMomentsScreen({ onNext, onBack }: ScreenProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const { setFavoriteMoments } = useFlow();
  const { trackEvent } = useAnalytics();
  const sfx = useSFX();

  useEffect(() => {
    trackEvent({
      name: ANALYTICS_EVENTS.SCREEN_VIEWED,
      params: { screen_name: "favorite-moments" },
    });
  }, [trackEvent]);

  const toggleItem = (id: number) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    if (selected.length === 0) return;

    sfx.play("whoosh");

    const selectedMoments = items
      .filter((item) => selected.includes(item.id))
      .map((item) => item.text);

    setFavoriteMoments(selectedMoments);

    trackEvent({
      name: ANALYTICS_EVENTS.BUTTON_CLICKED,
      params: {
        button_name: "move_on",
        screen: "favorite-moments",
        selected_count: selectedMoments.length,
        selected_moments: selectedMoments,
      },
    });

    onNext();
  };


  return (
    <Background color="#FFFAE9">
      <div className="min-h-screen flex flex-col px-[24px]">
        <div className="flex items-center justify-between pt-[22px] pb-[18px]">
          <button onClick={onBack}>
            <ArrowLeftIcon color="#141414" />
          </button>
          <button>
            <VolumeIcon color="#141414" />
          </button>
        </div>

        <div className="mt-[24px] text-center">
          <h4 className="text-[#141414] leading-[1.5]">
            Select your most memorable moment
          </h4>

          <div className="flex flex-wrap justify-center gap-[12px] mt-[24px]">
            {items.map((item) => {
              const isSelected = selected.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`
                    rounded-[16px] p-[3px] w-[107px] transition-all
                    ${
                      isSelected
                        ? "border-[0.5px] border-transparent shadow-[inset_0_0_0_2px_#FFB300] bg-[#FEF1C0]"
                        : "border-[0.5px] border-[#141414] shadow-none bg-transparent"
                    }
                  `}
                >
                  <div className="relative max-w-[107px] max-h-[88px] w-full h-[88px] rounded-[12px] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.text}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <p className="my-[12px] text-[#141414] text-[14px] text-center">
                    {item.text}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1" />

        <button
          className={`w-full py-[18px] rounded-full font-medium transition-colors ${
            selected.length > 0
            ? "bg-[#FFCB00] text-[#FFFFFF]"
            : "bg-[#FEF1C0] text-[#A2A2A2]"
          }`}
          disabled={selected.length === 0}
          onClick={handleContinue}
        >
          <p>Move on</p>
        </button>

        <div className="mt-[12px] flex flex-col gap-[12px] items-center px-[8px] pb-[32px] opacity-80">
          <p className="mt-[12px] text-[#141414] text-[10px]">
            Moments That Mattered
          </p>
          <LogoIcon color="#141414" />
        </div>
      </div>
    </Background>
  );
}
