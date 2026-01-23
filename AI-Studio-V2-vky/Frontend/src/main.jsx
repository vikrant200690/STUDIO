// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Navigation from "./navigation";
import "./index.css";
import { ChatProvider } from "../context/ChatContext";
import { AuthProvider } from "../context/AuthContext";  // ✅ Must import this

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>  {/* ✅ Must wrap everything */}
        <ChatProvider>
          <Navigation />
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
