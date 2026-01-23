// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // Adjust path based on your structure

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log("🔒 ProtectedRoute - isAuthenticated:", "isLoading:");

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl">🔐 Verifying authentication...</div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  // if (!isAuthenticated) {
  //   console.log("❌ Not authenticated, redirecting to /login");
  //   return <Navigate to="/login" replace />;
  // }

  // Render child routes if authenticated
  console.log("✅ Authenticated, rendering protected content");
  return <Outlet />;
};

export default ProtectedRoute;
