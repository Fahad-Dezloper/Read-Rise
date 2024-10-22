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

        const lendDate = new Date();
        const lendEndDate = new Date(lendDate.getTime() + lendDays * 24 * 60 * 60 * 1000);

        const newLendBook = await prisma.lendBook.create({
            data: {
                bookId: bookDetails.id,
                bookName: bookDetails.BookName, 
                bookAuthor: bookDetails.Author, 
                bookIsbn: ISBN,
                lendDate: new Date(),
                lendDays: lendDays,
                lendEndDate: lendEndDate,
                userId: (await prisma.user.findUnique({ where: { memberID } })).id
            }
        });

        // user update to include lend books in thier lentbook array
        const updateUserLend = await prisma.user.update({
            where: { memberID },
            data: {
                lendBooks: {
                    connect: { id: newLendBook.id }
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