import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ObjectId } from 'mongodb';  // This helps handle MongoDB ObjectIds

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
    console.log("Deleting book from book model");

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const bookId = searchParams.get('bookId'); 

        console.log("Request received: ", userId, bookId);

        if (!userId || !bookId) {
            return NextResponse.json({ error: 'userId or bookId is required' }, { status: 400 });
        }

        // Convert userId and bookId to ObjectId since MongoDB stores them as ObjectId
        const deleteBookModel = await prisma.lendBook.deleteMany({
            where: {
                id: bookId,  // Use `id` for MongoDB `_id` field
                userId: userId  // User's ObjectId
            }
        });

        console.log("Delete model successfully");
        return NextResponse.json(deleteBookModel);
    } catch (error) {
        console.log("Error deleting book", error);
        return NextResponse.json({ error: 'Error deleting book' }, { status: 500 });
    }
}
