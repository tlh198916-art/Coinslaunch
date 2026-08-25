import { createContext, useContext, useMemo, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

const ClusterContext = createContext(null);

export const useCluster = () => useContext(ClusterContext);

export function SolanaProvider({ children }) {
  const [cluster, setCluster] = useState("devnet");
  const endpoint = useMemo(
    () =>
      cluster === "devnet"
        ? process.env.REACT_APP_DEVNET_RPC || clusterApiUrl("devnet")
        : process.env.REACT_APP_MAINNET_RPC || clusterApiUrl("mainnet-beta"),
    [cluster],
  );

  return (
    <ClusterContext.Provider value={{ cluster, setCluster }}>
      <ConnectionProvider endpoint={endpoint} config={{ commitment: "confirmed" }}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ClusterContext.Provider>
  );
}
