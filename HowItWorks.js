import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Wallet, PencilLine, ImageUp, Rocket } from "lucide-react";

const COIN_IMG =
  "https://images.unsplash.com/photo-1672911640671-65d5dfa97d26?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwzfHxzb2xhbmElMjBjb2luJTIwM2QlMjByZW5kZXJ8ZW58MHx8fHwxNzg3NjM2NzUyfDA&ixlib=rb-4.1.0&q=85";

const CHAPTERS = [
  {
    num: "01",
    icon: Wallet,
    title: "Connect your wallet",
    body: "Hit connect and approve with Phantom or Solflare. Your wallet is your account — no emails, no signups, no custody. We never touch your keys.",
  },
  {
    num: "02",
    icon: PencilLine,
    title: "Define your coin",
    body: "Pick a name, a ticker, a supply and decimals. This is the identity wallets and explorers will display forever, so make it count.",
  },
  {
    num: "03",
    icon: ImageUp,
    title: "Upload & review",
    body: "Drop in your token image. We package it into standards-compliant Metaplex metadata and show you the full cost before anything leaves your wallet.",
  },
  {
    num: "04",
    icon: Rocket,
    title: "Deploy to Solana",
    body: "Approve one transaction. The mint, metadata and your full supply land on-chain in a single confirmation — usually under a minute.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const coinY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const coinRotate = useTransform(scrollYProgress, [0, 1], [-14, 14]);

  return (
    <section
      id="how"
      ref={ref}
      data-testid="how-it-works-section"
      className="relative overflow-hidden border-b border-[#1A1A1A] py-24 md:py-32"
    >
      <motion.img
        src={COIN_IMG}
        alt=""
        style={{ y: coinY, rotate: coinRotate }}
        className="pointer-events-none absolute -right-24 top-16 hidden w-[420px] rounded-full opacity-25 blur-[1px] lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF5500]">
            Flight manual
          </p>
          <h2 className="max-w-xl font-display text-3xl font-bold uppercase tracking-tight md:text-5xl">
            How to use the token creator
          </h2>
        </motion.div>

        <div className="mt-20 max-w-3xl">
          {CHAPTERS.map((c, i) => (
            <motion.div
              key={c.num}
              data-testid={`how-step-${c.num}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group grid gap-4 border-t border-[#1A1A1A] py-10 sm:grid-cols-[120px_1fr] md:gap-10"
            >
              <div className="flex items-start gap-4">
                <span className="font-display text-6xl font-black leading-none text-zinc-800 transition-colors duration-300 group-hover:text-[#FF5500]/40 md:text-7xl">
                  {c.num}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <c.icon className="h-5 w-5 text-[#FF5500]" />
                  <h3 className="font-display text-xl font-semibold uppercase tracking-tight text-white md:text-2xl">
                    {c.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-lg font-mono text-sm leading-relaxed text-zinc-400">
                  {c.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
