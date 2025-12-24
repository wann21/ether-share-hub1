import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { EthereumProvider } from "./contexts/EthereumContext";
import { IPFSProvider } from "./contexts/IPFSContext";

createRoot(document.getElementById("root")!).render(
  <EthereumProvider>
    <IPFSProvider>
      <App />
    </IPFSProvider>
  </EthereumProvider>
);
