import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppProvider } from "./context/AppContext.tsx";
import "leaflet/dist/leaflet.css";
import { SocketProvider } from "./context/SocketContext.tsx";

export const authService = "https://feastly-auth-latest.onrender.com";
export const restaurantService =
  "https://feastly-restaurant-latest.onrender.com";
export const utilsService = "https://feastly-utils-latest.onrender.com";
export const realtimeService = "https://feastly-realtime-latest.onrender.com";
export const riderService = "https://feastly-rider-latest.onrender.com";
export const adminService = "https://feastly-admin-latest.onrender.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="787475734792-t241690cnuvlck2ifdsf8fhp5cnu3fhj.apps.googleusercontent.com">
      <AppProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AppProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
