// UserContext.tsx
"use client"
import React, { createContext, useContext, useState } from 'react';

// Define the shape of the user data
interface User {
  name: string;
  email: string;
  memberId?: string;
  phoneNumber?: string;
  avatar?: string;
}

// Create the context
const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
} | null>(null);

// Create the provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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