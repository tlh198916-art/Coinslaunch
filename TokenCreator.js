import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  ImagePlus,
  Loader2,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { useCluster } from "@/solana/SolanaProvider";
import { createTokenOnChain } from "@/solana/createToken";

const API = process.env.REACT_APP_BACKEND_URL;
const STEPS = ["Details", "Media & Supply", "Deploy"];
const encoder = new TextEncoder();

const inputCls =
  "w-full rounded-md border border-[#1A1A1A] bg-[#0A0A0A] px-4 py-3.5 font-mono text-sm text-white placeholder:text-zinc-600 outline-none transition-colors duration-200 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500]";

const labelCls =
  "mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500";

export default function TokenCreator() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { cluster } = useCluster();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [supply, setSupply] = useState("1000000");
  const [decimals, setDecimals] = useState("9");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);

  const detailsValid =
    name.trim().length > 0 &&
    symbol.trim().length > 0 &&
    encoder.encode(name.trim()).length <= 32 &&
    encoder.encode(symbol.trim()).length <= 10;

  const mediaValid =
    !!image &&
    Number(supply) > 0 &&
    Number.isInteger(Number(decimals)) &&
    Number(decimals) >= 0 &&
    Number(decimals) <= 9;

  const explorerCluster = cluster === "devnet" ? "?cluster=devnet" : "";

  const pickImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const deploy = async () => {
    if (!wallet.connected || busy) return;
    setBusy(true);
    setStatus("Preparing launch sequence…");
    try {
      setStatus("Uploading image…");
      const fd = new FormData();
      fd.append("file", image);
      const imgRes = await fetch(`${API}/api/upload/image`, {
        method: "POST",
        body: fd,
      });
      if (!imgRes.ok) throw new Error("Image upload failed");
      const { id: imageId } = await imgRes.json();

      setStatus("Uploading metadata…");
      const metaRes = await fetch(`${API}/api/upload/metadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          symbol: symbol.trim().toUpperCase(),
          description: description.trim(),
          image: `${API}/api/i/${imageId}`,
        }),
      });
      if (!metaRes.ok) throw new Error("Metadata upload failed");
      const { id: metaId } = await metaRes.json();

      setStatus("Approve the transaction in your wallet…");
      const { mint, signature } = await createTokenOnChain({
        wallet,
        connection,
        uri: `${API}/api/m/${metaId}`,
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        decimals: Number(decimals),
        supply,
      });

      fetch(`${API}/api/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mint,
          owner: wallet.publicKey.toBase58(),
          cluster,
          name: name.trim(),
          symbol: symbol.trim().toUpperCase(),
          decimals: Number(decimals),
          initial_supply: supply,
          metadata_uri: `${API}/api/m/${metaId}`,
          signature,
        }),
      }).catch(() => {});

      setResult({ mint, signature });
      toast.success("Your coin is live on Solana");
    } catch (err) {
      const msg = err?.message || String(err);
      toast.error(
        msg.toLowerCase().includes("reject")
          ? "Transaction rejected in wallet"
          : msg.slice(0, 140),
      );
      setStatus("");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setStep(0);
    setName("");
    setSymbol("");
    setDescription("");
    setSupply("1000000");
    setDecimals("9");
    setImage(null);
    setPreview(null);
    setResult(null);
    setStatus("");
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const stepVariants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

  return (
    <section
      id="creator"
      data-testid="token-creator-section"
      className="relative border-b border-[#1A1A1A] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF5500]">
            Token creator
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-bold uppercase tracking-tight md:text-5xl">
            From idea to on-chain in three steps
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_380px]">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-md border border-[#1A1A1A] bg-[#0A0A0A] p-6 md:p-10"
          >
            <div className="mb-10 flex items-center gap-0" data-testid="creator-steps">
              {STEPS.map((label, i) => (
                <div key={label} className="flex flex-1 items-center last:flex-none">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[11px] font-bold transition-colors duration-300 ${
                        i < step || result
                          ? "border-[#FF5500] bg-[#FF5500] text-black"
                          : i === step
                            ? "border-[#FF5500] text-[#FF5500]"
                            : "border-[#2A2A2A] text-zinc-600"
                      }`}
                    >
                      {i < step || result ? <Check className="h-3.5 w-3.5" /> : `0${i + 1}`}
                    </span>
                    <span
                      className={`hidden font-mono text-[10px] font-bold uppercase tracking-[0.18em] sm:block ${
                        i === step ? "text-white" : "text-zinc-600"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="mx-4 h-px flex-1 bg-[#1A1A1A]">
                      <div
                        className="h-px bg-[#FF5500] transition-[width] duration-500"
                        style={{ width: i < step || result ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="success"
                  data-testid="deploy-success-panel"
                  {...stepVariants}
                  transition={{ duration: 0.45 }}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF5500]">
                      <Rocket className="h-6 w-6 text-black" />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-bold uppercase">
                        Launched
                      </h3>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
                        ${symbol.trim().toUpperCase()} is live on {cluster}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    {[
                      { label: "Mint address", value: result.mint, testid: "mint-address-value" },
                      { label: "Transaction", value: result.signature, testid: "tx-signature-value" },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-4 rounded-md border border-[#1A1A1A] bg-[#050505] px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                            {row.label}
                          </p>
                          <p
                            data-testid={row.testid}
                            className="truncate font-mono text-xs text-zinc-300"
                          >
                            {row.value}
                          </p>
                        </div>
                        <button
                          data-testid={`copy-${row.testid}`}
                          onClick={() => copy(row.value)}
                          className="shrink-0 text-zinc-500 transition-colors hover:text-[#FF5500]"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      data-testid="view-on-explorer-link"
                      href={`https://explorer.solana.com/address/${result.mint}${explorerCluster}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full bg-[#FF5500] px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-[#ff6a1f]"
                    >
                      View on explorer
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      data-testid="create-another-button"
                      onClick={reset}
                      className="rounded-full border border-[#2A2A2A] px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 transition-colors duration-200 hover:border-zinc-500 hover:text-white"
                    >
                      Create another
                    </button>
                  </div>
                </motion.div>
              ) : step === 0 ? (
                <motion.div
                  key="step0"
                  data-testid="creator-step-details"
                  {...stepVariants}
                  transition={{ duration: 0.45 }}
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="token-name" className={labelCls}>
                        Token name
                      </label>
                      <input
                        id="token-name"
                        data-testid="token-name-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={32}
                        placeholder="e.g. Moon Rocket"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="token-symbol" className={labelCls}>
                        Token symbol
                      </label>
                      <input
                        id="token-symbol"
                        data-testid="token-symbol-input"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        maxLength={10}
                        placeholder="e.g. MRKT"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label htmlFor="token-description" className={labelCls}>
                      Description <span className="text-zinc-700">(optional)</span>
                    </label>
                    <textarea
                      id="token-description"
                      data-testid="token-description-input"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={1000}
                      rows={3}
                      placeholder="One line about your coin."
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      data-testid="creator-next-step-1"
                      disabled={!detailsValid}
                      onClick={() => setStep(1)}
                      className="group flex items-center gap-3 rounded-md bg-[#FF5500] px-7 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-[#ff6a1f] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              ) : step === 1 ? (
                <motion.div
                  key="step1"
                  data-testid="creator-step-media"
                  {...stepVariants}
                  transition={{ duration: 0.45 }}
                >
                  <label className={labelCls}>Token image</label>
                  <label
                    data-testid="token-image-dropzone"
                    htmlFor="token-image"
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-[#2A2A2A] bg-[#050505] px-6 py-10 text-center transition-colors duration-200 hover:border-[#FF5500]/60"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Token preview"
                        className="h-20 w-20 rounded-md border border-[#1A1A1A] object-cover"
                      />
                    ) : (
                      <ImagePlus className="h-8 w-8 text-zinc-600" />
                    )}
                    <span className="font-mono text-xs text-zinc-500">
                      {image ? image.name : "PNG, JPG, GIF or WebP — max 3 MB"}
                    </span>
                    <input
                      id="token-image"
                      data-testid="token-image-input"
                      type="file"
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      className="hidden"
                      onChange={(e) => pickImage(e.target.files?.[0])}
                    />
                  </label>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="token-supply" className={labelCls}>
                        Total supply
                      </label>
                      <input
                        id="token-supply"
                        data-testid="token-supply-input"
                        type="number"
                        min="1"
                        step="1"
                        value={supply}
                        onChange={(e) => setSupply(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label htmlFor="token-decimals" className={labelCls}>
                        Decimals
                      </label>
                      <input
                        id="token-decimals"
                        data-testid="token-decimals-input"
                        type="number"
                        min="0"
                        max="9"
                        step="1"
                        value={decimals}
                        onChange={(e) => setDecimals(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      data-testid="creator-back-step-1"
                      onClick={() => setStep(0)}
                      className="flex items-center gap-2 rounded-md border border-[#2A2A2A] px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 transition-colors duration-200 hover:border-zinc-500 hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    <button
                      data-testid="creator-next-step-2"
                      disabled={!mediaValid}
                      onClick={() => setStep(2)}
                      className="group flex items-center gap-3 rounded-md bg-[#FF5500] px-7 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-[background-color,transform] duration-200 hover:scale-105 hover:bg-[#ff6a1f] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  data-testid="creator-step-deploy"
                  {...stepVariants}
                  transition={{ duration: 0.45 }}
                >
                  <div className="space-y-3">
                    {[
                      ["Name", name.trim()],
                      ["Symbol", `$${symbol.trim().toUpperCase()}`],
                      ["Supply", Number(supply).toLocaleString()],
                      ["Decimals", decimals],
                      ["Network", cluster],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between border-b border-[#1A1A1A] pb-3"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                          {k}
                        </span>
                        <span className="font-mono text-sm text-zinc-200">{v}</span>
                      </div>
                    ))}
                  </div>

                  <div
                    data-testid="fee-notice"
                    className="mt-6 rounded-md border border-[#FF5500]/25 bg-[#FF5500]/5 px-4 py-3.5 font-mono text-xs leading-relaxed text-zinc-400"
                  >
                    <span className="font-bold text-[#FF5500]">Fee notice — </span>
                    ~0.02 SOL network cost (mint rent + Metaplex metadata + token
                    account) is paid directly from your wallet. CoinLaunch
                    platform fee: <span className="text-white">0%</span> during
                    launch week.
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <button
                      data-testid="creator-back-step-2"
                      onClick={() => setStep(1)}
                      disabled={busy}
                      className="flex items-center gap-2 rounded-md border border-[#2A2A2A] px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 transition-colors duration-200 hover:border-zinc-500 hover:text-white disabled:opacity-40"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>

                    {wallet.connected ? (
                      <button
                        data-testid="deploy-token-button"
                        onClick={deploy}
                        disabled={busy}
                        className="group flex items-center gap-3 rounded-md bg-[#FF5500] px-8 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-[background-color,transform,box-shadow] duration-200 hover:scale-105 hover:bg-[#ff6a1f] hover:shadow-[0_0_40px_rgba(255,85,0,0.3)] disabled:cursor-wait disabled:opacity-60 disabled:hover:scale-100"
                      >
                        {busy ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {status || "Working…"}
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4" />
                            Deploy coin
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                          Connect Phantom or Solflare to deploy
                        </p>
                        <WalletMultiButton data-testid="creator-wallet-connect-button" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div
              data-testid="token-preview-card"
              className="rounded-md border border-[#1A1A1A] bg-[#0A0A0A] p-8"
            >
              <p className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
                Live preview
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#2A2A2A] bg-[#050505]">
                  {preview ? (
                    <img
                      src={preview}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Rocket className="h-6 w-6 text-[#FF5500]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    data-testid="preview-token-name"
                    className="truncate font-display text-lg font-bold text-white"
                  >
                    {name.trim() || "Your Coin"}
                  </p>
                  <p
                    data-testid="preview-token-symbol"
                    className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500"
                  >
                    ${symbol.trim() || "SYMBOL"}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-2 border-t border-[#1A1A1A] pt-5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Supply</span>
                  <span className="text-zinc-300">
                    {Number(supply || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Decimals</span>
                  <span className="text-zinc-300">{decimals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Network</span>
                  <span className="text-[#FF5500]">{cluster}</span>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-[#1A1A1A] bg-[#0A0A0A] p-8">
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
                What you get
              </p>
              <ul className="space-y-3 font-mono text-xs leading-relaxed text-zinc-400">
                {[
                  "Real SPL token with Metaplex metadata",
                  "Full supply minted to your wallet",
                  "You keep mint & update authority",
                  "Visible in Phantom, Solflare & explorers",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF5500]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
