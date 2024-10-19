// app/api/fetchUserLendBooks/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get All User who have lend books from the store

export async function GET(req: Request) {
    try {
      const users = await prisma.user.findMany({
        include: {
            lentBooks: true,
        },
    });
    return NextResponse.json(users);  
    } catch (error) {
        console.log("error fetching user data", error)
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}