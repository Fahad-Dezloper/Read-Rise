// app/api/UsersLendBooks/route.ts
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// get user based on member id who have lend books for return
export async function GET(req: Request) {
    // console.log("fetching users lend books for return")
    try {
        const { searchParams } = new URL(req.url);

        const memberID = searchParams.get('memberID');

        if (!memberID) {
            return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
        }
      
        const users = await prisma.user.findUnique({
        where: { memberID: (memberID) },
        include: {
            lendBooks: true,
        },
      });
        // console.log(users)
    return NextResponse.json(users);  
    } catch (error) {
        console.log("error fetching user data", error)
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}