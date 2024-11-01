// next-auth.d.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    email?: string;
    role?: string;
  }
}
