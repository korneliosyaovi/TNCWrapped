import { SVGProps } from 'react';
import { useAudio } from "@/components/AudioGate";
import { MutedIcon } from "@/assets/MutedIcon";
import { UnmutedIcon } from "@/assets/UnmutedIcon";

export default function VolumeButton({ ...props }: SVGProps<SVGSVGElement>) {
  const { muted, toggleMute } = useAudio();

  return (
    <button onClick={toggleMute}>
      {muted ? <MutedIcon {...props} /> : <UnmutedIcon {...props} />}
    </button>
  );
}
