import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains, provider } = configureChains(
  [chain.optimismGoerli],
  [
    jsonRpcProvider({
      rpc: () => {
        return {
          http: "https://goerli.optimism.io",
        };
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Fractional NFT",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />;
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
