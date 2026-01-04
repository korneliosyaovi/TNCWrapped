import Image from "next/image";
import Background from "../components/ui/Background";
import { LogoIcon } from "@/assets/LogoIcon";

export default function DesktopBlocker() {
  return (
    <Background
      color="#FFFAE9"
    >
      <div className="h-screen overflow-y-auto">
        <div className="min-h-screen flex flex-col px-[24px]">
          <div className="mt-[96px] text-center">
            <LogoIcon className="mx-auto mb-[32px]" width="48px" height="48px" color="#141414" />
            <div className="relative inline-block">
              <h2 className="header-shadow">OOPS!</h2>
              <h2 className="header gradient-text text-border-dark">OOPS!</h2>
            </div>
            <h4 className="text-[#272727] mt-[16px]">It is easier for a Camel...</h4>
            <p className="w-[345px] mx-auto text-[#272727] mt-[16px] leading-[1.5] tracking-[-0.3px]">
              ...to pass through the eye of a needle than for a desktop to display this Wrapped.
            </p>
          </div>

          <div className="mx-auto w-[320px] h-[392px] mt-[48px] bg-[#fef1c0] border border-[#ffb300] rounded-[20px] px-[40px] py-[40px]">
            <Image
              src="/images/qr-signup.png"
              alt="Mocile app QR code"
              width={240}
              height={240}
              className="mx-auto"
            />
            
            <p className="w-[240px] mx-auto text-[#272727] mt-[24px] leading-[1.5] tracking-[-0.3px]">
              Scan this to enter by the narrow gate (your phone).
            </p>
          </div>
        
          <div className="mt-[24px] mx-auto flex items-center space-x-[16px] px-[32px] py-[24px] mb-[48px] opacity-80">
            <p>
              <span className="text-[#141414] text-[10px]">Powered by .</span>
            </p>
            <LogoIcon color="#141414" style={{ height: "24px", width: "auto" }} />
          </div>

        </div>
      </div>
    </Background>
  );
}