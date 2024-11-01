/* eslint-disable @typescript-eslint/no-explicit-any */
// UserContext.tsx
"use client"
import React, { createContext, useContext, useState } from 'react';
import { User, Subscription } from '@/lib/typess'

// context
const UserContext = createContext<{
  user: User | null;
  subscription: Subscription | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
   setSubscription: React.Dispatch<React.SetStateAction<Subscription | null>>;
} | null>(null);

// provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  return (
    <UserContext.Provider value={{ user, subscription, setUser, setSubscription }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};