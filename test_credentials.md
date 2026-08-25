# Test Credentials
# Agent writes here when creating/modifying auth credentials (admin accounts, test users).
# Testing agent reads this before auth tests. Fork/continuation agents read on startup.

## CoinLaunch
- No app-level accounts. Authentication is wallet-based (Phantom / Solflare via Solana Wallet Standard).
- Cluster toggle in the header: **Devnet** (default, safe for testing) and **Mainnet**.
- To test token creation end-to-end: install Phantom or Solflare, switch the wallet to Devnet, fund it via https://faucet.solana.com, then connect and deploy.
- Backend endpoints used by the dApp: POST /api/upload/image, POST /api/upload/metadata, GET /api/i/{id}, GET /api/m/{id}, POST /api/tokens.
