import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { authOptions } = await import('../../../utils/authOptions'); // Adjust the path accordingly
    return NextAuth(req, res, authOptions);
};

export { handler as GET, handler as POST };