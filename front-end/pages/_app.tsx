import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const zkEVMChain: Chain = {
  id: 1402,
  name: "Polygon zkEVM Testnet",
  network: "zkevm",
  nativeCurrency: {
    decimals: 18,
    name: "zkEVM Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://rpc.public.zkevm-test.net",
  },
  blockExplorers: {
    default: {
      name: "zkEVM Explorer",
      url: "https://explorer.public.zkevm-test.net",
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [zkEVMChain],
  [
    jsonRpcProvider({
      rpc: () => {
        return {
          http: "https://rpc.public.zkevm-test.net",
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
