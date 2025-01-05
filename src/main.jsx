import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

import { StateContextProvider } from "./context";
import App from "./App";
import "./index.css";

// http://127.0.0.1:5173/

const root = ReactDOM.createRoot(document.getElementById("root"));

const sepolia = {
  chainId: 11155111,  // Sepolia Chain ID
  rpc: ["https://11155111.rpc.thirdweb.com/GLQdK2gijEqOuCFiLRwDb9Y9ncbJR36RZfqrMIILcmB6pdtgBTFiUDV3uu_7t0V7Zgt-O4UYfGhpi9firfIFfA"],  // Public Sepolia RPC
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

root.render(
  <ThirdwebProvider activeChain={sepolia} clientId={"f5a5df4731abc8efa81f535b2c02c4d7"}>
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);