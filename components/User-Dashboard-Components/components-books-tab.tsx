/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import Image from "next/image"
import { CalendarIcon  } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUser } from "@/app/UserContext"
import placeholder from '@/assets/placeholder.png'

interface Book {
  id: number;
  name: string;
  isbn: string;
  image: string;
  returnDate?: string;
  issueDate?: string;
  boughtOn?: string;
  author: string;
}

// Define the structure of a Lent Book
interface LendBook {
  id: number;
  bookName: string;
  bookIsbn: string;
  lendDate: string; // date when the book was lent
  lendEndDate: string; // return date
  book: {
    Images: Array<{
      url: string; // URL of the book image
    }>
  };
  bookAuthor: string; // author of the lent book
}

// Define the structure of a Purchased Book
interface PurchasedBook {
  id: number;
  bookName: string;
  bookIsbn: string;
  purchaseDate: string; // date when the book was bought
  book: {
    Images: Array<{
      url: string; // URL of the book image
    }>
  };
  bookAuthor: string; // author of the purchased book
}

// Define the structure of the User
interface User {
  id: number; // Assuming there's an ID for the user
  name: string; // User's name
  lendBooks: LendBook[]; // Array of lent books
  purchasedBooks: PurchasedBook[]; // Array of purchased books
}


export function BooksTab() {
  
  function formatLendDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();

    // Determine the suffix for the day
    const suffix = (day % 10 === 1 && day !== 11) ? "st" :
                   (day % 10 === 2 && day !== 12) ? "nd" :
                   (day % 10 === 3 && day !== 13) ? "rd" : "th";

    return `${day}${suffix} ${month}, ${year}`;
}

  const { user } = useUser();
  if (!user) {
    return <p>Loading User lend Books details...</p>;
  }
  console.log("Hi i am user details", user);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Books Issued</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Lent Books */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Books Lent</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-h-[20.3vw] overflow-y-auto">
              {user.lendBooks?.map((lendBook: LendBook) => (
                <Dialog key={lendBook.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:bg-gray-100 transition-colors h-fit">
                      <CardContent className="flex items-center space-x-4 p-4">
                         <Image
                            src={lendBook.book.Images[0]?.url || placeholder}
                            alt={lendBook.bookName}
                            width={60}
                            height={80}
                            className="object-cover"
                          />
                        <div>
                          <p className="font-medium">{lendBook.bookName}</p>
                          <p className="text-sm text-gray-500">ISBN: {lendBook.bookIsbn}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <CalendarIcon className="mr-1 h-4 w-4" />
                            Return by: {formatLendDate(lendBook.lendEndDate)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{lendBook.bookName}</DialogTitle>
                      <DialogDescription>
                        <p>Author: {lendBook.bookAuthor}</p>
                        <p>ISBN:  {lendBook.bookIsbn}</p>
                        <p>Issue Date: {formatLendDate(lendBook.lendDate)}</p>
                        <p>Return Date: {formatLendDate(lendBook.lendEndDate)}</p>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>

          {/* Bought Books */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Books Bought</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-[20.3vw] overflow-y-auto">
              {user.purchasedBooks?.map((purchasedBook: PurchasedBook) => (
                <Dialog key={purchasedBook.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:bg-gray-100 transition-colors h-fit">
                      <CardContent className="flex items-center space-x-4 p-4">
                         <Image
                            src={purchasedBook.book.Images[0]?.url || placeholder}
                            alt={purchasedBook.bookName}
                            width={60}
                            height={80}
                            className="object-cover"
                          />
                        <div>
                          <p className="font-medium">{purchasedBook.bookName}</p>
                          <p className="text-sm text-gray-500">ISBN: {purchasedBook.bookIsbn}</p>
                          <p className="text-sm text-gray-500">Bought on: {formatLendDate(purchasedBook.purchaseDate)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{purchasedBook.bookName}</DialogTitle>
                      <DialogDescription>
                        <p>Author: {purchasedBook.bookAuthor}</p>
                        <p>ISBN: {purchasedBook.bookIsbn}</p>
                        <p>Purchase Date: {formatLendDate(purchasedBook.purchaseDate)}</p>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}