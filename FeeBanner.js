import { Flame } from "lucide-react";

export default function FeeBanner() {
  return (
    <div
      data-testid="fee-banner"
      className="relative z-50 flex items-center justify-center gap-2 bg-[#FF5500] px-4 py-2 text-center font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black md:text-xs"
    >
      <Flame className="h-3.5 w-3.5" strokeWidth={2.5} />
      <span>
        Launch week — create coin fee slashed · platform fee 0% · mint for ~0.02 SOL network cost
      </span>
    </div>
  );
}
