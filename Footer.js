import { Rocket, Twitter, Github } from "lucide-react";
import { scrollToId } from "@/lib/scrollTo";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FF5500]">
                <Rocket className="h-4 w-4 text-black" strokeWidth={2.5} />
              </span>
              <span className="font-display text-sm font-bold uppercase tracking-[0.22em]">
                CoinLaunch
              </span>
            </div>
            <p className="mt-5 max-w-sm font-mono text-xs leading-relaxed text-zinc-500">
              The fastest way to launch a Solana token. Non-custodial,
              wallet-based, built on the SPL token standard and Metaplex.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <div className="flex gap-6">
              {[
                { label: "Create", id: "creator", testid: "footer-create-link" },
                { label: "How it works", id: "how", testid: "footer-how-link" },
                { label: "FAQ", id: "faq", testid: "footer-faq-link" },
              ].map((l) => (
                <button
                  key={l.id}
                  data-testid={l.testid}
                  onClick={() => scrollToId(l.id)}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 transition-colors duration-200 hover:text-white"
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <a
                data-testid="footer-twitter-link"
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-colors duration-200 hover:text-[#FF5500]"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                data-testid="footer-github-link"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 transition-colors duration-200 hover:text-[#FF5500]"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-[#1A1A1A] pt-8 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700">
            © 2026 CoinLaunch — Built on Solana
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-700">
            Not financial advice. Meme coins are volatile. Launch responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
