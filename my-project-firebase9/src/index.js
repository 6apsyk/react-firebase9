import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { firebaseConfig } from "./firebaseConfig";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
const auth = getAuth();


ReactDOM.render(
  <React.StrictMode>
    <App auth={auth} />
  </React.StrictMode>,
  document.getElementById("root")
);
