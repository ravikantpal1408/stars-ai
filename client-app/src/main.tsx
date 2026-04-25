import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Change this line:
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
