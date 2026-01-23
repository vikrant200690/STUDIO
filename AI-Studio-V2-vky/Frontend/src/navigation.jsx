// src/navigation.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import App from "./App";
import Sidebar from "./components/sidebar";
import "./index.css";
import Knowledge from "./pages/Knowledge";
import Plugins from "./pages/Plugins";
import LoadingPage from "./pages/LodingPage";
import SettingsComponent from "./pages/setting";
import Studio from "./pages/studio";
import StartupKits from "./pages/StartupKits";
import Scripts from "./pages/Scripts";
import ProtectedRoute from "./components/ProtectedRoute";  
import SignupOTP from './pages/SignupOTP';
import LoginOTP from './pages/LoginOTP';
import LandingPage from "./pages/LandingPage";
import TestingMethodologies from "./pages/TestingMethodologies";
import FiinOps from "./pages/FinOps";
// import OpenInDevEnv from "./components/AVIEWER.JSX";
import ToolMatrix from "./components/ToolMatrix";
export default function Navigation() {
  return (
    <div className="flex">
      <Routes>
        {/* ✅ Public routes - NO authentication required */}
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginOTP />} />
        <Route path="/signup-otp" element={<SignupOTP />} />
        <Route path="/landingpage" element={<LandingPage/>}/>
        {/* <Route path="/repoopen" element={<OpenInDevEnv/>}/> */}

        {/* ✅ WRAP ALL PROTECTED ROUTES IN ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          {/* Settings standalone WITHOUT sidebar - PROTECTED */}
          <Route path="/settings/*" element={<SettingsComponent />} />

          {/* All other routes WITH sidebar - PROTECTED */}
          <Route
            path="*"
            element={
              <>
                <Sidebar />
                <div className="flex-1">
                  <Routes>
                    {/* Redirect root to analytics */}
                    <Route path="/" element={<Navigate to="/analytics" replace />} />

                    {/* All these routes are NOW PROTECTED */}
                    <Route path="/analytics" element={<AnalyticsDashboard />} />
                    <Route path="/chat" element={<App />} />
                    <Route path="/knowledge" element={<Knowledge />} />
                    <Route path="/plugins" element={<Plugins />} />
                    <Route path="/studio" element={<Studio />} />
                    <Route path="/startupkits" element={<StartupKits />} />
                    <Route path="/scripts" element={<Scripts />} />
                    <Route path="/signup" element={<SignupOTP />} />
                    <Route path="/login" element={<LoginOTP />} />
                    {/* Fallback */}
                    <Route path="*" element={<LoadingPage />} />
                    <Route path="/testingmethods" element={<TestingMethodologies/>}/>
                    <Route path="/toolmatrix" element={<ToolMatrix/>}/>
                    <Route path="/finops" element={<FiinOps/>}/>
                  </Routes>
                </div>
              </>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}
