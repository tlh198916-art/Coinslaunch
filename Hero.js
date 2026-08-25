import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, Timer } from "lucide-react";
import { scrollToId } from "@/lib/scrollTo";

const HERO_BG =
  "https://images.unsplash.com/photo-1700508317396-e343a69ac72f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxvcmFuZ2UlMjByb2NrZXQlMjBsYXVuY2glMjBjaW5lbWF0aWN8ZW58MHx8fHwxNzg3NjM2NzUyfDA&ixlib=rb-4.1.0&q=85";

const LINES = [
  { text: "CREATE A SOLANA", accent: false },
  { text: "MEME COIN IN", accent: false },
  { text: "SECONDS.", accent: true },
];

const STATS = [
  { icon: Zap, value: "~45s", label: "Avg. time to mint" },
  { icon: ShieldCheck, value: "0%", label: "Platform fee" },
  { icon: Timer, value: "No code", label: "Wallet only" },
];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      data-testid="hero-section"
      className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden border-b border-[#1A1A1A]"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <img
          src={HERO_BG}
          alt=""
          className="h-[120%] w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[#050505] [mask-image:linear-gradient(to_top,black,transparent)]" />
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="mx-auto w-full max-w-7xl px-5 pb-20 pt-24 md:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8 flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF5500]"
        >
          <span className="h-px w-10 bg-[#FF5500]" />
          SPL token standard · Metaplex metadata
        </motion.p>

        <h1
          data-testid="hero-headline"
          className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tighter sm:text-7xl lg:text-[7.5rem]"
        >
          {LINES.map((line, i) => (
            <span key={line.text} className="block overflow-hidden pb-1">
              <motion.span
                className={`block ${line.accent ? "text-[#FF5500]" : "text-white"}`}
                initial={{ y: "112%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.25 + i * 0.14,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-8 max-w-xl font-mono text-sm leading-relaxed text-zinc-400 md:text-base"
        >
          No coding required. Connect your wallet, name it, launch it — your
          coin is live on Solana before your coffee cools.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            data-testid="hero-launch-button"
            onClick={() => scrollToId("creator")}
            className="group flex items-center gap-3 rounded-full bg-[#FF5500] px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition-[background-color,box-shadow,transform] duration-200 hover:scale-105 hover:bg-[#ff6a1f] hover:shadow-[0_0_40px_rgba(255,85,0,0.35)]"
          >
            Launch your coin
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button
            data-testid="hero-how-button"
            onClick={() => scrollToId("how")}
            className="rounded-full border border-[#2A2A2A] px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 transition-colors duration-200 hover:border-zinc-500 hover:text-white"
          >
            How it works
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.15 }}
          className="mt-16 grid max-w-2xl grid-cols-3 divide-x divide-[#1A1A1A] border-y border-[#1A1A1A]"
        >
          {STATS.map((s) => (
            <div key={s.label} className="px-5 py-5 first:pl-0">
              <div className="flex items-center gap-2">
                <s.icon className="h-3.5 w-3.5 text-[#FF5500]" />
                <span className="font-display text-lg font-bold text-white md:text-xl">
                  {s.value}
                </span>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
