import prisma from '@/lib/prisma';
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { v4 as uuidv4 } from 'uuid';

export const authOptions: AuthOptions = {
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
        async jwt({token, user}) {
            return {...token, ...user};
        },
        async session({ session, token }) {
            session.user.role = token.role;
            return session;
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };