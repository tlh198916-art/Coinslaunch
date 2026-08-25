import { Rocket } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useCluster } from "@/solana/SolanaProvider";
import { scrollToId } from "@/lib/scrollTo";

const NAV = [
  { label: "Create", id: "creator", testid: "nav-create-link" },
  { label: "How it works", id: "how", testid: "nav-how-link" },
  { label: "FAQ", id: "faq", testid: "nav-faq-link" },
];

export default function Header() {
  const { cluster, setCluster } = useCluster();

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-40 border-b border-white/5 bg-[#050505]/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <button
          data-testid="brand-logo-button"
          onClick={() => window.__lenis?.scrollTo(0)}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FF5500]">
            <Rocket className="h-4.5 w-4.5 text-black" strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm font-bold uppercase tracking-[0.22em]">
            CoinLaunch
          </span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              data-testid={item.testid}
              onClick={() => scrollToId(item.id)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 transition-colors duration-200 hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            data-testid="cluster-toggle"
            className="hidden items-center rounded-full border border-[#1A1A1A] bg-[#0A0A0A] p-1 sm:flex"
          >
            {["devnet", "mainnet-beta"].map((c) => (
              <button
                key={c}
                data-testid={`cluster-toggle-${c === "devnet" ? "devnet" : "mainnet"}`}
                onClick={() => setCluster(c)}
                className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors duration-200 ${
                  cluster === c
                    ? "bg-[#FF5500] text-black"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {c === "devnet" ? "Devnet" : "Mainnet"}
              </button>
            ))}
          </div>
          <WalletMultiButton data-testid="wallet-connect-button" />
        </div>
      </div>
    </header>
  );
}
