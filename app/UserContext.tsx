// UserContext.tsx
"use client"
import React, { createContext, useContext, useState } from 'react';

interface User {
  name: string;
  email: string;
  memberID?: string;
  phoneNumber?: string;
  avatar?: string;
}

interface Subscription {
  id: string;
  userId: string;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
}

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