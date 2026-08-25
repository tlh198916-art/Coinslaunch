import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "What is CoinLaunch?",
    a: "CoinLaunch is a wallet-based Solana token creator. It packages the full on-chain workflow — mint creation, Metaplex metadata and initial supply — into a three-step form. There are no accounts and no custody: your wallet is your identity, and every transaction is signed by you, in your wallet.",
  },
  {
    q: "How does token creation actually work?",
    a: "When you deploy, we upload your image and metadata, then build a single Solana transaction that creates an SPL mint, attaches standards-compliant Metaplex metadata (name, symbol, image), creates your token account and mints the full supply to it. You approve once in Phantom or Solflare and the token is live — visible in wallets and explorers immediately.",
  },
  {
    q: "How much are the fees?",
    a: "The only cost is the Solana network cost of roughly 0.02 SOL, which covers mint rent, the metadata account and your token account. It is paid directly from your wallet — nothing is routed through us. During launch week the CoinLaunch platform fee is 0%. You always see the exact transaction in your wallet before approving.",
  },
  {
    q: "How does liquidity management work?",
    a: "The full initial supply is minted straight to your wallet, and you keep both mint and update authority. That means you decide what happens next: seed a liquidity pool on a DEX like Raydium or Meteora, lock or burn LP tokens, or revoke mint authority for a fixed supply. CoinLaunch never holds your tokens or your authority.",
  },
];

export default function Faq() {
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="border-b border-[#1A1A1A] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF5500]">
              Ground control
            </p>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-5xl">
              Questions,
              <br />
              answered
            </h2>
            <p className="mt-6 max-w-sm font-mono text-sm leading-relaxed text-zinc-400">
              Everything you need to know before you light the fuse. No fine
              print, no hidden mechanics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${i}`}
                  data-testid={`faq-item-${i}`}
                  className="border-b border-[#1A1A1A]"
                >
                  <AccordionTrigger
                    data-testid={`faq-question-${i}`}
                    className="py-6 text-left font-display text-base font-semibold uppercase tracking-tight text-white transition-colors duration-200 hover:text-[#FF5500] hover:no-underline md:text-lg"
                  >
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent
                    data-testid={`faq-answer-${i}`}
                    className="pb-6 font-mono text-sm leading-relaxed text-zinc-400"
                  >
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
