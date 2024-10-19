import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch and Update the book quantity
export async function PUT(req: Request) {
    console.log("updating lend data to user");
    try {
        const { searchParams } = new URL(req.url);
        const ISBN = searchParams.get('isbn');
        const memberID = searchParams.get('memberId');
        const lendDays = Number(searchParams.get('lendDays'));
        console.log("request recived of : ", ISBN, memberID, lendDays)
        if (!ISBN || !memberID) {
            return NextResponse.json({error: 'ISBN/memberID/lendDays is required'}, {status : 400})
        }

        // Fetch book details from book model
        const bookDetails = await prisma.book.findUnique({
            where: { ISBN }
        });

        if (!bookDetails) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        const newLentBook = await prisma.lentBook.create({
            data: {
                bookId: bookDetails.id,
                bookName: bookDetails.BookName, 
                bookAuthor: bookDetails.Author, 
                bookIsbn: ISBN,
                lendDate: new Date(),
                lendDays: lendDays,
                userId: (await prisma.user.findUnique({ where: { memberID } })).id // Find the user and get their ID
            }
        });

        // user update to include lend books in thier lentbook array
        const updateUserLend = await prisma.user.update({
            where: { memberID },
            data: {
                lentBooks: {
                    connect: { id: newLentBook.id }
                }
            }
        })

        console.log("updated user book lend", updateUserLend)
        return NextResponse.json(updateUserLend)
    } catch (error) {
        console.log("Error Lending Boook to user", error)
         return NextResponse.json({ error: 'Error lending book to user' }, { status: 500 });
    }

}