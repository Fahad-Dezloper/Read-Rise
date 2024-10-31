/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface User {
        role: string; // Add the role property
    }

    interface Session {
        user: User; // Extend session user to include our custom User type
    }
}
