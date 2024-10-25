// app/api/UsersPurchaseBookReturn/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// user book return update user model
export async function DELETE(req: Request) {
    console.log("Deleting a book from user's lendBooks");

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const purchaseBookId = searchParams.get('purchaseBookId'); // This is the specific lend book's id

        if (!userId || !purchaseBookId) {
            return NextResponse.json({ error: 'userId or lendBookId is required' }, { status: 400 });
        }

        // Delete the specific book from the user's lendBooks
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                purchasedBooks: {
                    delete: { id: purchaseBookId }, // Delete the lendBook by its id
                },
            },
            include: {
                purchasedBooks: true, // Return the updated lendBooks
            },
        });

        console.log("Updated user lendBooks after deletion:", updatedUser.purchasedBooks);
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.log("Error deleting lendBook", error);
        return NextResponse.json({ error: 'Error deleting lendBook' }, { status: 500 });
    }
}