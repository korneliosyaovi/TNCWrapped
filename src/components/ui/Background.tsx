"use client";

import React from "react";
import clsx from "clsx";

type BackgroundProps = {
  color?: string;
  image?: string; 
  className?: string;
  children: React.ReactNode;
};

export default function Background({
  color,
  image,
  className,
  children,
}: BackgroundProps) {
  return (
    <div
      className={clsx(
        "min-h-screen w-full bg-cover bg-center bg-no-repeat z-0",
        className
      )}
      style={{
        backgroundColor: color,
        backgroundImage: image ? `url(${image})` : undefined,
      }}
    >
      {children}
    </div>
  );
}
