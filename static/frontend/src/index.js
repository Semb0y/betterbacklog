import React from "react";
import ReactDOM from "react-dom/client";
import { view } from "@forge/bridge";
import "@atlaskit/css-reset";
import App from "./App";
import "./global.css";

view.theme.enable().catch((err) => console.error("Error enabling theme", err));

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
