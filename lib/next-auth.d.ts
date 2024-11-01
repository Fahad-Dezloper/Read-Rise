/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
    user: {
      role?: string; // Add other custom fields as needed
    };
  }
  interface User {
    role?: string;
  }
}
