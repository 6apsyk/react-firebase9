import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { firebaseConfig } from "./firebaseConfig";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
