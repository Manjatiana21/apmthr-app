import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { NotificationsProvider } from "./components/NotificationsContext";
import "slick-carousel/slick/slick.css"; 
import "./styles/slick-theme.css";
import './styles/responsive.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </React.StrictMode>
);

reportWebVitals();

// ✅ Enregistrement du Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(registration => {
        console.log("✅ Service Worker enregistré:", registration);
      })
      .catch(error => {
        console.error("❌ Erreur Service Worker:", error);
      });
  });
}
