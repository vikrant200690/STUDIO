// context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkAuth } from '../src/services/tokenService';  // Adjust path

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  
  


  const verifyAuth = async () => {
    try {
      console.log("🔍 AuthContext - Verifying authentication...");
      const userData = await checkAuth();
      
      if (userData) {
        console.log("✅ AuthContext - User authenticated:");
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        console.log("❌ AuthContext - Not authenticated");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("❌ AuthContext - Authentication check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    verifyAuth,
    setUser,
    setIsAuthenticated,
    logout,
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated, 
      setIsAuthenticated, 
      verifyAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
