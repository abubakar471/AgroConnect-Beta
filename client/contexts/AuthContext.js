'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockFarmers, mockBuyers } from '@/lib/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Simulate getting current user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('agroconnect_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    // Mark that we've finished the initial load from localStorage
    setInitialized(true);
  }, []);

  const login = (phone) => {
    // Simulate OTP login - check if user exists
    const farmer = mockFarmers.find(f => f.phone === phone);
    const buyer = mockBuyers.find(b => b.phone === phone);
    
    const user = farmer || buyer;
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('agroconnect_user', JSON.stringify(user));
      return { success: true, user, isNewUser: false };
    }
    
    // New user - needs to select role
    return { success: true, user: null, isNewUser: true, phone };
  };

  const setUser = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(!!user);
    if (user) localStorage.setItem('agroconnect_user', JSON.stringify(user));
    else localStorage.removeItem('agroconnect_user');
  };

  const selectRole = (phone, role, name) => {
    // Create new user with selected role
    const newUser = {
      id: `${role[0]}${Date.now()}`,
      clerkId: `clerk_${role}_${Date.now()}`,
      name,
      role,
      verified: false,
      phone,
      location: '',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('agroconnect_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('agroconnect_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('agroconnect_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        initialized,
        login,
        logout,
        selectRole,
        setUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
