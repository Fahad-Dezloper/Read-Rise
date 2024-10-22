import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch and Update the book quantity
export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const ISBN = searchParams.get('isbn');

        console.log("request received for ISBN: ", ISBN);

        if (!ISBN) {
            return NextResponse.json({ error: 'ISBN is required' }, { status: 400 });
        }

        // Check if the book with the given ISBN exists
        const book = await prisma.book.findUnique({
            where: { ISBN },
        });

        if (!book) {
            // If the book is not found, return a 404 error
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        // Update the book quantity if the book exists
        const updatedBook = await prisma.book.update({
            where: { ISBN },
            data: {
                Quantity: {
                    increment: 1
                },
            },
        });

        console.log("Updated book quantity:", updatedBook);
        return NextResponse.json(updatedBook);

    } catch (error) {
        console.log("Error Lending Book:", error);
        return NextResponse.json({ error: 'Error lending book' }, { status: 500 });
    }
}
