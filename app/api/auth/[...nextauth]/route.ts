// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/app/utils/authOptions'; // Ensure this path is correct
import { NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';

// Combine types for compatibility
type CombinedRequest = NextRequest & NextApiRequest;
type CombinedResponse = NextApiResponse;

// Create the handler function
const handler = async (req: CombinedRequest, res: CombinedResponse) => {
    return await NextAuth(req, res, authOptions);
};

// Exporting GET and POST handlers
export { handler as GET, handler as POST };