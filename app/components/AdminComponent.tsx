// components/AdminComponent.tsx
"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

const AdminComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/queries/admin');
        setUsers(response.data);
      } catch (err) {
        setError('Error fetching users');
      }
    };
      console.log(users);
    fetchUsers();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
};

export default AdminComponent;