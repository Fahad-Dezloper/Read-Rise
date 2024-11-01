"use client";
import React, { createContext, useContext, useState } from 'react';
import { AdminUser, User } from '@/shared/usertypes';

interface AdminContextType {
  adminUser: AdminUser | null;
  setAdminUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
  adminUsers: User[]; // Add this line
   adminSetUsers: (updateFunction: (prevUsers: User[]) => User[]) => void; 
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);

   const adminSetUsers = (updateFunction: (prevUsers: User[]) => User[]) => {
    setAdminUsers((prevUsers) => updateFunction(prevUsers));
  };

  return (
    <AdminContext.Provider value={{ adminUser, setAdminUser, adminUsers, adminSetUsers }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
