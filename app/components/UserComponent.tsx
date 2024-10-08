// components/UserComponent.tsx
"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
    email: string;
    role: string;
}

interface UserComponentProps {
  email: string; // Pass the logged-in user's email as a prop
}

const UserComponent: React.FC<UserComponentProps> = ({ email }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/queries/user?email=${email}`);
        setUser(response.data);
      } catch (err) {
        setError('Error fetching user data', err);
      }
    };

    fetchUser();
  }, [email]);

  if (error) return <div>{error}</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default UserComponent;