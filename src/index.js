import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ScrollToTop from "./ScrollToTop";
import { BrowserRouter } from "react-router-dom";
import "animate.css";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "jquery";
import "popper.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
