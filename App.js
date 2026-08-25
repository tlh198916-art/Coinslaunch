import { useEffect } from "react";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import { SolanaProvider } from "@/solana/SolanaProvider";
import FeeBanner from "@/components/FeeBanner";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TokenCreator from "@/components/TokenCreator";
import Ribbon from "@/components/Ribbon";
import HowItWorks from "@/components/HowItWorks";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <SolanaProvider>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FF5500] selection:text-black">
        <FeeBanner />
        <Header />
        <main>
          <Hero />
          <TokenCreator />
          <Ribbon />
          <HowItWorks />
          <Faq />
        </main>
        <Footer />
        <Toaster theme="dark" position="bottom-right" />
      </div>
    </SolanaProvider>
  );
}

export default App;
