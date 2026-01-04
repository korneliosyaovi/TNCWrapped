"use client";

import Image from "next/image";

type ImageChipsProps = {
  imgSrc: string
};

export default function ImageChips({ imgSrc }: ImageChipsProps) {
  const yOffsets = [-260, -160, -100, -64, -28];

  return (
    <div className="relative w-full h-[360px] pointer-events-none">
      {/* background chips */}
      {yOffsets.map((y, i) => (
        <div
          key={i}
          className="chip bg"
          style={{
            ["--fy" as string]: `${48 + y}px`,
            animationDelay: `${0.12 + (yOffsets.length - 1 - i) * 0.06}s`, // subtle trailing
          }}
        />
      ))}

      {/* main chip */}
      <div
        className="chip main relative"
        style={{
          ["--fy" as string]: `48px`,
          animationDelay: `0.06s`, // almost immediate
        }}
      >
        <Image
          src={imgSrc}
          alt="persona"
          fill
          className="object-cover"
          priority
        />
      </div>

      <style jsx>{`
        .chip {
          position: absolute;
          left: 50%;
          top: 0;
          width: 260px;
          height: 260px;
          border-radius: 9999px;
          border: 2px solid #fff;
          background: #000;
          overflow: hidden;
          transform-origin: center;
          transform: translate(-50%, -360px) scale(0.5);
          animation-name: dropGrow;
          animation: dropGrow 1200ms ease forwards;
          will-change: transform;
        }

        .bg {
          z-index: 0;
          opacity: 0.95;
        }

        .main {
          z-index: 10;
        }

        @keyframes dropGrow {
          to {
            transform: translate(-50%, var(--fy)) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .chip {
            animation: none;
            transform: translate(-50%, var(--fy)) scale(1);
          }
        }

        .chip,
        .chip * {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
