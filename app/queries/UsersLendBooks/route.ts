// app/api/UsersLendBooks/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get All User who have lend books from the store

export async function GET(req: Request) {
    try {
      const users = await prisma.user.findMany({
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

// user book return update user model
export async function DELETE(req: Request) {
    console.log("Deleting a book from user's lendBooks");

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const lendBookId = searchParams.get('lendBookId'); // This is the specific lend book's id

        if (!userId || !lendBookId) {
            return NextResponse.json({ error: 'userId or lendBookId is required' }, { status: 400 });
        }

        // Delete the specific book from the user's lendBooks
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                lendBooks: {
                    delete: { id: lendBookId }, // Delete the lendBook by its id
                },
            },
            include: {
                lendBooks: true, // Return the updated lendBooks
            },
        });

        console.log("Updated user lendBooks after deletion:", updatedUser.lendBooks);
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.log("Error deleting lendBook", error);
        return NextResponse.json({ error: 'Error deleting lendBook' }, { status: 500 });
    }
}