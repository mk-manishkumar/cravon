import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register PWA Service Worker for mobile installation & caching
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("Cravon Driver PWA active, scope:", reg.scope);
      })
      .catch((err) => {
        console.warn("Driver PWA registration error:", err);
      });
  });
}

ReactDOM.createRoot(document.getElementById("app")!).render(<App />);
