import prisma from '@/lib/prisma';
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'


const generateRandomDigits = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

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
                const firstName = profile.given_name.toLowerCase();
                const localPart = profile.email.split('@')[0];
                const lastFourChars = localPart.slice(-4);

                const memberID = `${firstName}@${lastFourChars}${generateRandomDigits()}`;
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