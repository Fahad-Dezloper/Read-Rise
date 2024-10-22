import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch and Update the book quantity
export async function PUT(req: Request) {
    // console.log("fetching lend data");
    try {
        const { searchParams } = new URL(req.url);
        const ISBN = searchParams.get('isbn');
        const Quantity = Number(searchParams.get('quantity'));
        // console.log("request recived of book: ", ISBN, Quantity);
        if (!ISBN || !Quantity) {
            return NextResponse.json({error: 'ISBN is required'}, {status : 400})
        }
        const updateBookQuan = await prisma.book.update({
            where: { ISBN },
            data: {
                Quantity: {
                    decrement: Quantity
                },
            }
        })
        // console.log("updated book quantity", updateBookQuan)
        return NextResponse.json(updateBookQuan)
    } catch (error) {
        // console.log("Error Lending Book", error)
         return NextResponse.json({ error: 'Error lending book' }, { status: 500 });
    }

}