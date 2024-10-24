// app/api/UsersPurchasedBooks/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// get user based on member id who have Bought books for return tab
export async function GET(req: Request) {
    console.log("fetching users lend books for return")
    try {
        const { searchParams } = new URL(req.url);

        const memberID = searchParams.get('memberID');

        if (!memberID) {
            return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
        }
      
        const users = await prisma.user.findUnique({
        where: { memberID: (memberID) },
        include: {
            purchasedBooks: true,
        },
      });
        console.log(users)
    return NextResponse.json(users);  
    } catch (error) {
        console.log("error fetching user data", error)
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}