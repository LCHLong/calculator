import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Gỡ React.StrictMode để tránh double render khi test UI
createRoot(document.getElementById("root")).render(
  <App />
);
