# CoinLaunch — PRD

## Original problem statement
Build a dark, crypto-native landing page for a Solana token creator ("CoinLaunch"): fast, simple, urgent feel; hero "create a Solana meme coin in seconds, no coding"; fee notice banner about the lower create-coin fee; compact token creation flow (name, symbol, image upload, Next button); minimal utility-focused look (deep black surfaces, muted gray text, subtle borders); how-to-use steps section; FAQ (what CoinLaunch is, how creation works, fees & liquidity management); trustworthy, technical, wallet-based, rocket-themed. User choices: REAL Solana integration with wallet adapter (Phantom/Solflare) and real fee payments; orange/amber rocket theme; Awwwards-level motion (framer-motion, lenis, masked hero reveal, marquee, parallax).

## Architecture
- Frontend: React (CRA/craco), Tailwind, framer-motion, lenis, react-fast-marquee, @solana/wallet-adapter-react(-ui), @solana/web3.js, @solana/spl-token.
- On-chain: single transaction built in the browser — SPL mint create + initializeMint + hand-serialized Metaplex CreateMetadataAccountV3 (index 33) + ATA create + mintTo. Signed by the user's wallet. (Metaplex umi/mpl JS SDKs were dropped — webpack ESM/CJS interop breaks in CRA.)
- Backend: FastAPI + MongoDB. Hosts token images (base64 in Mongo) and Metaplex metadata JSON so metadata URIs stay short and reachable; stores launched-token records.
- Endpoints: POST /api/upload/image, GET /api/i/{id}, POST /api/upload/metadata, GET /api/m/{id}, POST /api/tokens, GET /api/tokens/recent.
- Clusters: devnet (default) / mainnet-beta toggle in header; RPC via REACT_APP_DEVNET_RPC / REACT_APP_MAINNET_RPC with clusterApiUrl fallback.

## User personas
- Meme-coin degen who wants a token live in under a minute with zero code.
- Crypto-native builder who wants authority retained and standards-compliant metadata.

## Core requirements (static)
1. Fee notice banner. 2. Kinetic hero with no-code message. 3. Compact 3-step token creation (name/symbol → image/supply/decimals → review & deploy). 4. Real wallet connect (Phantom/Solflare). 5. How-to steps section. 6. FAQ. 7. Dark orange/amber rocket aesthetic.

## Implemented (2026-08-25)
- Full landing page: fee banner, glass header w/ cluster toggle + WalletMultiButton, masked line-reveal hero w/ parallax rocket bg, 3-step TokenCreator w/ live preview card + success panel (mint, signature, explorer link), editorial marquee, numbered "flight manual" chapters w/ parallax coin, FAQ accordion, footer.
- Real on-chain deploy flow (uploads → metadata → one wallet-signed tx).
- Backend image/metadata hosting + token records (verified via curl).
- Lenis smooth scroll, noise overlay, wallet-adapter UI themed orange.

## Verification status
- Backend endpoints: all verified via curl (upload, serve, metadata, records).
- Frontend: all sections + step 1→2 form flow + FAQ verified via screenshots; no console/compile errors.
- NOT verified: actual wallet connect + on-chain transaction (needs Phantom/Solflare browser extension + funded wallet; cannot run headless). Test on devnet via faucet first.

## Backlog
- P0: End-to-end devnet deploy test with a real wallet; private RPC for mainnet.
- P1: Move metadata hosting to IPFS (Pinata) for permanence; revoke-authority option (fixed supply); recent-launches feed UI from /api/tokens/recent.
- P2: Liquidity pool creation wizard (Raydium/Meteora); token-2022 support; custom RPC input.
