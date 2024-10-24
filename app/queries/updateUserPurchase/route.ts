import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch and Update the book quantity
export async function PUT(req: Request) {
    console.log("updating user purchase data to user");
    try {
        const { searchParams } = new URL(req.url);
        const ISBN = searchParams.get('isbn');
        const memberID = searchParams.get('memberId');
        const price = Number(searchParams.get('price'));
        const paymentMethod = searchParams.get('paymentMethod');
        console.log("request recived of for purchase : ", ISBN, memberID, price, paymentMethod)
        if (!ISBN || !memberID ||  price === null || !paymentMethod) {
            return NextResponse.json({error: 'ISBN/memberID/price/paymentMethod is required'}, {status : 400})
        }

        // Fetch book details from book model
        const bookDetails = await prisma.book.findUnique({
            where: { ISBN }
        });

        if (!bookDetails) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        const newPurchaseBook = await prisma.purchsedBook.create({
            data: {
                bookId: bookDetails.id,
                bookName: bookDetails.BookName, 
                bookAuthor: bookDetails.Author, 
                bookIsbn: ISBN,
                purchaseDate: new Date(),
                amount: price,
                purchaseMethod: paymentMethod,
                userId: (await prisma.user.findUnique({ where: { memberID } })).id
            }
        });

        // user update to include purchased books in thier Purchased books array
        const updateUserPurchase = await prisma.user.update({
            where: { memberID },
            data: {
                purchasedBooks: {
                    connect: { id: newPurchaseBook.id }
                }
            }
        })

        console.log("updated user book lend", updateUserPurchase)
        return NextResponse.json(updateUserPurchase)
    } catch (error) {
        console.log("Error Lending Boook to user", error)
         return NextResponse.json({ error: 'Error lending book to user' }, { status: 500 });
    }

}