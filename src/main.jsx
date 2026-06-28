import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "@app/App";
import { AppProviders } from "@app/providers/AppProviders";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </AppProviders>
  </StrictMode>
);
