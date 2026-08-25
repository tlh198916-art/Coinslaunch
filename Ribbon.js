import Marquee from "react-fast-marquee";

const ITEMS = [
  "Fast",
  "Secure",
  "No code",
  "0% platform fee",
  "SPL standard",
  "CoinLaunch",
];

export default function Ribbon() {
  return (
    <div
      data-testid="editorial-marquee"
      className="overflow-hidden border-b border-[#1A1A1A] bg-[#050505] py-6"
    >
      <Marquee speed={35} gradient={false} pauseOnHover>
        {ITEMS.concat(ITEMS).map((item, i) => (
          <span
            key={i}
            className="mx-8 flex items-center gap-16 font-mono text-sm font-bold uppercase tracking-[0.35em] text-zinc-700"
          >
            {item}
            <span className="text-[#FF5500]">•</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
