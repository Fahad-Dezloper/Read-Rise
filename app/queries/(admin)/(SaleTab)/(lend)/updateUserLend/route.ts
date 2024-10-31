import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch and Update the book quantity
export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const ISBN = Number(searchParams.get('isbn'));
        const memberID = searchParams.get('memberId');
        const lendDays = Number(searchParams.get('lendDays'));

        if (!ISBN || !memberID) {
            return NextResponse.json({ error: 'ISBN/memberID/lendDays is required' }, { status: 400 });
        }

        // Fetch book details from book model
        const bookDetails = await prisma.book.findUnique({
            where: { ISBN },
        });

        if (!bookDetails) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        const lendDate = new Date();
        const lendEndDate = new Date(lendDate.getTime() + lendDays * 24 * 60 * 60 * 1000);

        // Find user by memberID
        const user = await prisma.user.findUnique({
            where: { memberID },
        });

        // If user not found, return an error response
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const newLendBook = await prisma.lendBook.create({
            data: {
                bookId: bookDetails.id,
                bookName: bookDetails.BookName,
                bookAuthor: bookDetails.Author,
                bookIsbn: ISBN,
                lendDate,
                lendDays,
                lendEndDate,
                userId: user.id, // Safe access to user.id now
            },
        });

        // Update user's lent books
        const updateUserLend = await prisma.user.update({
            where: { memberID },
            data: {
                lendBooks: {
                    connect: { id: newLendBook.id },
                },
            },
        });

        return NextResponse.json(updateUserLend);
    } catch (error) {
        console.log('Error Lending Book to user', error);
        return NextResponse.json({ error: 'Error lending book to user' }, { status: 500 });
    }
}
