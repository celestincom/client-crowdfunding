import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";

// Context and App imports
import { StateContextProvider } from "./context";
import App from "./App";

// Styles
import "./index.css";

// Sepolia Network Configuration
const SEPOLIA_CHAIN = {
  chainId: 11155111,  // Sepolia Chain ID
  rpc: [
    "https://11155111.rpc.thirdweb.com/GLQdK2gijEqOuCFiLRwDb9Y9ncbJR36RZfqrMIILcmB6pdtgBTFiUDV3uu_7t0V7Zgt-O4UYfGhpi9firfIFfA"
  ],  // Public Sepolia RPC
  nativeCurrency: {
    name: "SepoliaETH",
    symbol: "ETH",
    decimals: 18,
  },
  shortName: "sepolia",
  slug: "sepolia",
  testnet: true,
  chain: "ETH",
};

// Client ID for thirdweb
const CLIENT_ID = "f5a5df4731abc8efa81f535b2c02c4d7";

// Root element for ReactDOM
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <ThirdwebProvider activeChain={SEPOLIA_CHAIN} clientId={CLIENT_ID}>
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);
