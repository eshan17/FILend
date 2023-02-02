/** @format */

import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

// import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit";
// import { SiweMessage } from "siwe";

// import { SessionProvider } from "next-auth/react";
// import { AppProps } from "next/app";

// import {
//   RainbowKitSiweNextAuthProvider,
//   GetSiweMessageOptions,
// } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { getDefaultWallets, darkTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  filecoinHyperspace,
  filecoin,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const getSiweMessageOptions = () => ({
  statement: "Sign in to my RainbowKit app",
});

// const defaultChains: Chain[] = [
const defaultChains = [
  {
    ...mainnet,
  },

  {
    ...filecoin,
    iconUrl: "https://i.imgur.com/oo7FPwT.png",
  },

  {
    ...filecoinHyperspace,
    iconUrl: "https://i.imgur.com/oo7FPwT.png",
  },

  {
    ...polygon,
  },
  { ...optimism },

  { ...arbitrum },
  // { ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []) },
];

const { chains, provider, webSocketProvider } = configureChains(
  // [
  //   mainnet,
  //   filecoinHyperspace,
  //   filecoin,
  //   polygon,
  //   optimism,
  //   arbitrum,
  //   ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  // ],
  defaultChains,
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: "Ol2-sdEOu9L-vkvwuM9ZcTVZnDWxBqOT",
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
