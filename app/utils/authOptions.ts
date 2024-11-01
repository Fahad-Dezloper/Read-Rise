/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from 'next-auth/providers/google'
import { v4 as uuidv4 } from 'uuid';
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {

                const memberID = `BOOKIE/${uuidv4().slice(0, 5).toUpperCase()}`;
                return ({
                    id: profile.sub,
                    name: `${profile.given_name} ${profile.family_name}`,
                    email: profile.email,
                    image: profile.picture,
                    memberID,
                    role: profile.email == "fahad.khan2216@gmail.com" ? "admin" : "user",
                    subscription: {
                        create: {
                        planType: 'BASIC',
                        status: 'ACTIVE',
                        startDate: new Date(),
                        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                        },
                    },
                })
            }
        })
    ],
    callbacks: {
    async jwt({ token, user }) {
        if (user) {
            console.log("User:", user);
            token = { ...token, ...user }; // Merge user data into token
        }
        return token;
    },
    async session({ session, token }) {
        console.log("Token:", token);
        if (token.role) {
            session.user.role = token.role;
        }
        return session;
    }
}



}