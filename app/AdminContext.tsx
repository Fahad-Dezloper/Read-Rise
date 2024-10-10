// AdminContext.tsx
"use client"
import React, { createContext, useContext, useState } from 'react';
import { AdminUser } from '@/shared/usertypes'; // Adjust the import based on your file structure

interface AdminContextType {
  adminUser: AdminUser[];
  setAdminUser: React.Dispatch<React.SetStateAction<AdminUser[]>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  return (
    <AdminContext.Provider value={{ adminUser, setAdminUser }}>
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